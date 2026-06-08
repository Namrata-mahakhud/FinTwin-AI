import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { authService } from '../../../services/auth.service';
import { authenticate } from '../../../middleware/auth.middleware';
import { RegisterRequest, LoginRequest, UpdateProfileRequest } from '../../../types';

export default async function authRoutes(fastify: FastifyInstance): Promise<void> {
  /**
   * @route POST /api/v1/auth/register
   * @desc Register a new user
   * @access Public
   */
  fastify.post<{ Body: RegisterRequest }>(
    '/register',
    {
      schema: {
        tags: ['Authentication'],
        description: 'Register a new user',
        body: {
          type: 'object',
          required: ['email', 'password', 'firstName', 'lastName'],
          properties: {
            email: { type: 'string', format: 'email' },
            password: { type: 'string', minLength: 8 },
            firstName: { type: 'string', minLength: 1 },
            lastName: { type: 'string', minLength: 1 },
            role: { type: 'string', enum: ['ANALYST', 'RISK_MANAGER', 'PORTFOLIO_MANAGER', 'ADMIN'] },
          },
        },
        response: {
          201: {
            type: 'object',
            properties: {
              user: {
                type: 'object',
                properties: {
                  id: { type: 'string' },
                  email: { type: 'string' },
                  role: { type: 'string' },
                  firstName: { type: 'string' },
                  lastName: { type: 'string' },
                },
              },
              token: { type: 'string' },
              refreshToken: { type: 'string' },
            },
          },
        },
      },
    },
    async (request: FastifyRequest<{ Body: RegisterRequest }>, reply: FastifyReply) => {
      const result = await authService.register(request.body);
      return reply.code(201).send(result);
    }
  );

  /**
   * @route POST /api/v1/auth/login
   * @desc Login user
   * @access Public
   */
  fastify.post<{ Body: LoginRequest }>(
    '/login',
    {
      schema: {
        tags: ['Authentication'],
        description: 'Login user',
        body: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            email: { type: 'string', format: 'email' },
            password: { type: 'string' },
          },
        },
        response: {
          200: {
            type: 'object',
            properties: {
              user: {
                type: 'object',
                properties: {
                  id: { type: 'string' },
                  email: { type: 'string' },
                  role: { type: 'string' },
                  firstName: { type: 'string' },
                  lastName: { type: 'string' },
                },
              },
              token: { type: 'string' },
              refreshToken: { type: 'string' },
            },
          },
        },
      },
    },
    async (request: FastifyRequest<{ Body: LoginRequest }>, reply: FastifyReply) => {
      const result = await authService.login(request.body);
      return reply.send(result);
    }
  );

  /**
   * @route POST /api/v1/auth/refresh
   * @desc Refresh access token
   * @access Public
   */
  fastify.post<{ Body: { refreshToken: string } }>(
    '/refresh',
    {
      schema: {
        tags: ['Authentication'],
        description: 'Refresh access token',
        body: {
          type: 'object',
          required: ['refreshToken'],
          properties: {
            refreshToken: { type: 'string' },
          },
        },
      },
    },
    async (request: FastifyRequest<{ Body: { refreshToken: string } }>, reply: FastifyReply) => {
      const result = await authService.refreshToken(request.body.refreshToken);
      return reply.send(result);
    }
  );

  /**
   * @route GET /api/v1/auth/profile
   * @desc Get current user profile
   * @access Private
   */
  fastify.get(
    '/profile',
    {
      preHandler: authenticate,
      schema: {
        tags: ['Authentication'],
        description: 'Get current user profile',
        security: [{ bearerAuth: [] }],
      },
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const user = await authService.getUserById(request.user!.userId);
      if (!user) {
        return reply.code(404).send({ error: 'User not found' });
      }
      return reply.send(user);
    }
  );

  /**
   * @route PUT /api/v1/auth/profile
   * @desc Update user profile
   * @access Private
   */
  fastify.put<{ Body: UpdateProfileRequest }>(
    '/profile',
    {
      preHandler: authenticate,
      schema: {
        tags: ['Authentication'],
        description: 'Update user profile',
        security: [{ bearerAuth: [] }],
        body: {
          type: 'object',
          properties: {
            firstName: { type: 'string' },
            lastName: { type: 'string' },
            preferences: {
              type: 'object',
              properties: {
                theme: { type: 'string' },
                notifications: { type: 'boolean' },
                defaultCurrency: { type: 'string' },
              },
            },
          },
        },
      },
    },
    async (request: FastifyRequest<{ Body: UpdateProfileRequest }>, reply: FastifyReply) => {
      const user = await authService.updateProfile(request.user!.userId, request.body);
      return reply.send(user);
    }
  );

  /**
   * @route POST /api/v1/auth/logout
   * @desc Logout user (client-side token removal)
   * @access Private
   */
  fastify.post(
    '/logout',
    {
      preHandler: authenticate,
      schema: {
        tags: ['Authentication'],
        description: 'Logout user',
        security: [{ bearerAuth: [] }],
      },
    },
    async (_request: FastifyRequest, reply: FastifyReply) => {
      return reply.send({ message: 'Logged out successfully' });
    }
  );
}

// Made with Bob
