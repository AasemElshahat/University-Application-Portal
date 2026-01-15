import { config } from "../config/config";
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const secretKey = config.jwtSecret

declare global {
  namespace Express {
    interface Request {
      user?: {
        userID: string;
        isAdministrator: boolean;
      };
    }
  }
}

export const authenticateToken = async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.header('Authorization');

  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ Error: "Access denied, no token provided" });
    }

    try {
      const payload = jwt.verify(token, secretKey) as { userID: string; isAdministrator: boolean };
      req.user = payload;
      
      next();
    } catch (error) {
      return res.status(401).json({ Error: "Invalid token" });
    }
  } else {
    return res.status(401).json({ Error: "Access denied, no Bearer token" });
  }
};