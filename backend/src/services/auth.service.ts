import { User, IUser, UserRole } from '../models/user.model';
import { JWTUtil } from '../utils/jwt.util';
import { ApiError, AuthResponse, RegisterRequest, LoginRequest } from '../types';
import { logger } from '../config/logger';

export class AuthService {
  /**
   * Register a new user
   */
  async register(data: RegisterRequest): Promise<AuthResponse> {
    try {
      // Check if user already exists
      const existingUser = await User.findOne({ email: data.email });
      if (existingUser) {
        throw new ApiError(409, 'User with this email already exists');
      }

      // Create new user
      const user = new User({
        email: data.email,
        passwordHash: data.password, // Will be hashed by pre-save hook
        firstName: data.firstName,
        lastName: data.lastName,
        role: data.role || UserRole.ANALYST,
      });

      await user.save();

      logger.info(`New user registered: ${user.email}`);

      // Generate tokens
      const tokenPayload = {
        userId: user._id.toString(),
        email: user.email,
        role: user.role,
      };

      const token = JWTUtil.generateAccessToken(tokenPayload);
      const refreshToken = JWTUtil.generateRefreshToken(tokenPayload);

      return {
        user: {
          id: user._id.toString(),
          email: user.email,
          role: user.role,
          firstName: user.firstName,
          lastName: user.lastName,
        },
        token,
        refreshToken,
      };
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      logger.error('Registration error:', error);
      throw new ApiError(500, 'Failed to register user');
    }
  }

  /**
   * Login user
   */
  async login(data: LoginRequest): Promise<AuthResponse> {
    try {
      // Find user with password
      const user = await User.findOne({ email: data.email }).select('+passwordHash');
      if (!user) {
        throw new ApiError(401, 'Invalid email or password');
      }

      // Verify password
      const isPasswordValid = await user.comparePassword(data.password);
      if (!isPasswordValid) {
        throw new ApiError(401, 'Invalid email or password');
      }

      // Update last login
      user.lastLogin = new Date();
      await user.save();

      logger.info(`User logged in: ${user.email}`);

      // Generate tokens
      const tokenPayload = {
        userId: user._id.toString(),
        email: user.email,
        role: user.role,
      };

      const token = JWTUtil.generateAccessToken(tokenPayload);
      const refreshToken = JWTUtil.generateRefreshToken(tokenPayload);

      return {
        user: {
          id: user._id.toString(),
          email: user.email,
          role: user.role,
          firstName: user.firstName,
          lastName: user.lastName,
        },
        token,
        refreshToken,
      };
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      logger.error('Login error:', error);
      throw new ApiError(500, 'Failed to login');
    }
  }

  /**
   * Refresh access token
   */
  async refreshToken(refreshToken: string): Promise<{ token: string; refreshToken: string }> {
    try {
      // Verify refresh token
      const payload = JWTUtil.verifyRefreshToken(refreshToken);

      // Find user
      const user = await User.findById(payload.userId);
      if (!user) {
        throw new ApiError(401, 'User not found');
      }

      // Generate new tokens
      const tokenPayload = {
        userId: user._id.toString(),
        email: user.email,
        role: user.role,
      };

      const newToken = JWTUtil.generateAccessToken(tokenPayload);
      const newRefreshToken = JWTUtil.generateRefreshToken(tokenPayload);

      return {
        token: newToken,
        refreshToken: newRefreshToken,
      };
    } catch (error) {
      logger.error('Token refresh error:', error);
      throw new ApiError(401, 'Invalid or expired refresh token');
    }
  }

  /**
   * Get user by ID
   */
  async getUserById(userId: string): Promise<IUser | null> {
    try {
      return await User.findById(userId);
    } catch (error) {
      logger.error('Get user error:', error);
      throw new ApiError(500, 'Failed to get user');
    }
  }

  /**
   * Update user profile
   */
  async updateProfile(
    userId: string,
    data: { firstName?: string; lastName?: string; preferences?: Record<string, unknown> }
  ): Promise<IUser> {
    try {
      const user = await User.findById(userId);
      if (!user) {
        throw new ApiError(404, 'User not found');
      }

      if (data.firstName) user.firstName = data.firstName;
      if (data.lastName) user.lastName = data.lastName;
      if (data.preferences) {
        user.preferences = { ...user.preferences, ...data.preferences };
      }

      await user.save();

      logger.info(`User profile updated: ${user.email}`);

      return user;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      logger.error('Update profile error:', error);
      throw new ApiError(500, 'Failed to update profile');
    }
  }
}

export const authService = new AuthService();

// Made with Bob
