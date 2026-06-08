import Fastify from 'fastify';
import cors from '@fastify/cors';
import helmet from '@fastify/helmet';
import rateLimit from '@fastify/rate-limit';
import swagger from '@fastify/swagger';
import swaggerUi from '@fastify/swagger-ui';
import { config } from './config/environment';
import { logger } from './config/logger';
import { database } from './config/database';
import { errorHandler, notFoundHandler } from './middleware/error.middleware';
import v1Routes from './api/v1';

async function buildServer() {
  const fastify = Fastify({
    logger: true,
    trustProxy: true,
  });

  // Register plugins
  await fastify.register(helmet, {
    contentSecurityPolicy: config.app.isProduction,
  });

  await fastify.register(cors, {
    origin: config.cors.origin,
    credentials: true,
  });

  await fastify.register(rateLimit, {
    max: config.rateLimit.maxRequests,
    timeWindow: config.rateLimit.windowMs,
  });

  // Swagger documentation
  await fastify.register(swagger, {
    swagger: {
      info: {
        title: 'FinTwin AI API',
        description: 'Autonomous Financial Digital Twin for Market Shock Simulation',
        version: '1.0.0',
      },
      host: `localhost:${config.app.port}`,
      schemes: ['http', 'https'],
      consumes: ['application/json'],
      produces: ['application/json'],
      tags: [
        { name: 'Authentication', description: 'Authentication endpoints' },
        { name: 'Scenarios', description: 'Scenario management endpoints' },
        { name: 'Simulations', description: 'Simulation execution endpoints' },
        { name: 'Portfolios', description: 'Portfolio management endpoints' },
        { name: 'Analytics', description: 'Analytics and reporting endpoints' },
      ],
      securityDefinitions: {
        bearerAuth: {
          type: 'apiKey',
          name: 'Authorization',
          in: 'header',
          description: 'Enter your bearer token in the format: Bearer <token>',
        },
      },
    },
  });

  await fastify.register(swaggerUi, {
    routePrefix: '/api/docs',
    uiConfig: {
      docExpansion: 'list',
      deepLinking: true,
    },
  });

  // Register API routes
  await fastify.register(v1Routes, { prefix: `/api/${config.app.apiVersion}` });

  // Error handlers - cast to any to avoid type issues
  fastify.setErrorHandler(errorHandler as any);
  fastify.setNotFoundHandler(notFoundHandler as any);

  // Root endpoint
  fastify.get('/', async () => {
    return {
      name: 'FinTwin AI API',
      version: '1.0.0',
      description: 'Autonomous Financial Digital Twin for Market Shock Simulation',
      documentation: '/api/docs',
      health: '/api/v1/health',
    };
  });

  return fastify;
}

async function start() {
  try {
    // Connect to database
    await database.connect();

    // Build and start server
    const fastify = await buildServer();
    
    await fastify.listen({
      port: config.app.port,
      host: '0.0.0.0',
    });

    logger.info(`Server running on http://localhost:${config.app.port}`);
    logger.info(`API Documentation: http://localhost:${config.app.port}/api/docs`);
    logger.info(`Environment: ${config.app.env}`);
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
}

// Handle graceful shutdown
process.on('SIGINT', async () => {
  logger.info('SIGINT received, shutting down gracefully...');
  await database.disconnect();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  logger.info('SIGTERM received, shutting down gracefully...');
  await database.disconnect();
  process.exit(0);
});

// Start server
if (require.main === module) {
  start();
}

export { buildServer, start };

// Made with Bob
