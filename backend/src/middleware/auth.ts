import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config/env';

export interface AuthPayload { id: string; role: 'worker' | 'employer'; }

export interface AuthRequest extends Request {
  user?: AuthPayload;
}

export function signToken(payload: AuthPayload): string {
  return jwt.sign(payload, config.JWT_SECRET, { expiresIn: '7d' });
}

export function requireAuth(roles?: Array<'worker' | 'employer'>) {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    const header = req.headers.authorization || '';
    const token = header.startsWith('Bearer ') ? header.substring(7) : null;
    if (!token) return res.status(401).json({ message: 'Unauthorized' });
    try {
      const decoded = jwt.verify(token, config.JWT_SECRET) as AuthPayload & { iat: number, exp: number };
      if (roles && !roles.includes(decoded.role)) {
        return res.status(403).json({ message: 'Forbidden' });
      }
      req.user = { id: decoded.id, role: decoded.role };
      next();
    } catch {
      return res.status(401).json({ message: 'Invalid token' });
    }
  };
}