import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { Socket } from "socket.io";
import logger from "../../config/logger";

declare module "socket.io" {
    interface Socket {
        user?: any;
    }
}

declare global {
    namespace Express {
        interface Request {
            user?: any;
        }
    }
}

const SECRET_KEY: string = process.env.SECRET_KEY!;

function authMiddleware(req: Request, res: Response, next: NextFunction): void {
    try {
        const cookieHeader = req.headers.cookie;
        let token: string | undefined;

        if (cookieHeader) {
            const match = cookieHeader.match(/token=([^;]+)/);
            token = match ? match[0].split("=")[1] : undefined;
        }
        if (!token) {
            res.status(401).json({ message: "Unauthorized" });
            return;
        }

        const decoded = jwt.verify(token, SECRET_KEY);

        // Ensure req.body exists
        if (!req.body) {
            req.body = {};
        }

        req.body.user = decoded;
        req.user = decoded;
        next();
    } catch (err) {
        logger.error("Error in auth Middleware: ", { error: err });
        res.status(401).json({ message: "Invalid token" });
        return;
    }
}

function authMiddlewareSocket(socket: Socket, next: any) {
    try {
        const cookieHeader = socket.handshake.headers.cookie;
        let token: string | undefined;
        if (cookieHeader) {
            const match = cookieHeader.match(/token=([^;]+)/);
            token = match ? match[0].split("=")[1] : undefined;
        }

        if (!token) {
            return next(new Error("Unauthorized: No token provided"));
        }

        const SECRET_KEY: string = process.env.SECRET_KEY!;
        const decoded = jwt.verify(token, SECRET_KEY);
        socket.user = decoded;

        logger.info("Socket authenticated for user:");
        logger.info(decoded);

        next();
    } catch (err) {
        logger.error("Socket authentication error:", { error: err });
        next(new Error("Unauthorized: Invalid token"));
    }
}

export { authMiddleware, authMiddlewareSocket };
