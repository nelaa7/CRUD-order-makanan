import { AuthPayload } from "../dto";
import { ValidateSign } from "../utility";
import { Request, Response, NextFunction } from "express";

declare global {
    namespace Express{
        interface Request{
            user?: AuthPayload
        }
    }
}

export const Authenticate = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const isValid = await ValidateSign(req, res, next);

        if (isValid) {
            next();
        } else {
            return res.status(401).json({ message: 'Not authorized' });
        }
    } catch (error) {
        console.error('Authentication error:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
}