import jwt, { Secret, SignOptions } from 'jsonwebtoken';
import { config } from '../config/environment';
import { JWTPayload } from '../types';

export class JWTUtil {
  /**
   * Generate access token
   */
  static generateAccessToken(payload: Omit<JWTPayload, 'iat' | 'exp'>): string {
    const options: SignOptions = {
      expiresIn: config.jwt.expiresIn as unknown as SignOptions['expiresIn'],
    };

    return jwt.sign(payload, config.jwt.secret as Secret, options);
  }

  /**
   * Generate refresh token
   */
  static generateRefreshToken(payload: Omit<JWTPayload, 'iat' | 'exp'>): string {
    const options: SignOptions = {
      expiresIn: config.jwt.refreshExpiresIn as unknown as SignOptions['expiresIn'],
    };

    return jwt.sign(payload, config.jwt.refreshSecret as Secret, options);
  }

  /**
   * Verify access token
   */
  static verifyAccessToken(token: string): JWTPayload {
    try {
      return jwt.verify(token, config.jwt.secret) as JWTPayload;
    } catch (error) {
      throw new Error('Invalid or expired token');
    }
  }

  /**
   * Verify refresh token
   */
  static verifyRefreshToken(token: string): JWTPayload {
    try {
      return jwt.verify(token, config.jwt.refreshSecret) as JWTPayload;
    } catch (error) {
      throw new Error('Invalid or expired refresh token');
    }
  }

  /**
   * Decode token without verification (for debugging)
   */
  static decodeToken(token: string): JWTPayload | null {
    try {
      return jwt.decode(token) as JWTPayload;
    } catch (error) {
      return null;
    }
  }
}
