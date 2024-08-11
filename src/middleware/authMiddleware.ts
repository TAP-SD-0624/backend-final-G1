import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models';
import { isTokenBlacklisted } from '../helpers/tokenBlacklist';

const authAndRoleMiddleware = (allowedRoles: string[]) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return res.status(401).json({ error: 'Authorization header missing' });
        }

        const token = authHeader.split(' ')[1];
        if (!token) {
            return res.status(401).json({ error: 'Token missing from header' });
        }

        if (isTokenBlacklisted(token)) {
            return res.status(401).json({ error: 'Token has been invalidated' });
        }

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET || "jwt_secret") as { id: number, role: string };
            const user = await User.findByPk(decoded.id);

            if (!user) {
                return res.status(401).json({ error: 'User not found' });
            }

            if (!allowedRoles.includes(user.role)) {
                return res.status(403).json({ error: 'Access forbidden: insufficient role' });
            }

            (req as any).user = user;
            next();
        } catch (error) {
            if (error instanceof jwt.TokenExpiredError) {
                return res.status(401).json({ error: 'Token has expired' });
            }
            if (error instanceof jwt.JsonWebTokenError) {
                return res.status(401).json({ error: 'Invalid token' });
            }
            console.error('Authorization error:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    };
};

export default authAndRoleMiddleware;
