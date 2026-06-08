import { FastifyRequest, FastifyReply } from 'fastify';
import { JWTUtil } from '../utils/jwt.util';
import { ApiError } from '../types';
import { UserRole } from '../models/user.model';

/**
 * Authenticate user from JWT token
 */
export async function authenticate(request: FastifyRequest, reply: FastifyReply): Promise<void> {
  try {
    const authHeader = request.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new ApiError(401, 'No token provided');
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix

    // Verify token
    const payload = JWTUtil.verifyAccessToken(token);

    // Attach user to request
    request.user = payload;
  } catch (error) {
    if (error instanceof ApiError) {
      return reply.code(error.statusCode).send({ error: error.message });
    }
    return reply.code(401).send({ error: 'Invalid or expired token' });
  }
}

/**
 * Authorize user based on roles
 */
export function authorize(...allowedRoles: UserRole[]) {
  return async (request: FastifyRequest, reply: FastifyReply): Promise<void> => {
    if (!request.user) {
      return reply.code(401).send({ error: 'Unauthorized' });
    }

    if (!allowedRoles.includes(request.user.role)) {
      return reply.code(403).send({ error: 'Forbidden: Insufficient permissions' });
    }
  };
}

/**
 * Optional authentication - doesn't fail if no token
 */
export async function optionalAuth(request: FastifyRequest, _reply: FastifyReply): Promise<void> {
  try {
    const authHeader = request.headers.authorization;

    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      const payload = JWTUtil.verifyAccessToken(token);
      request.user = payload;
    }
  } catch (error) {
    // Silently fail - user remains undefined
  }
}

// Made with Bob
