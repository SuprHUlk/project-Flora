import { Request, Response, NextFunction } from "express";
import logger from "../../config/logger";
import { getIO } from "../../handler/socket";
import { getRedis } from "../../database/redis";
import {
    Notification,
    getEventNameString,
} from "../../model/notificationModel";

declare module "express" {
    interface Locals {
        notification: Notification;
    }
}

async function notificationMiddleware(
    _: Request,
    res: Response,
    next: NextFunction
) {
    try {
        logger.info("Notification middleware");

        const notification: Notification = res.locals.notification;
        logger.info(notification);

        if (!notification) {
            next();
        }

        notification.receivers.forEach(async (receiver: string) => {
            //check user is online
            let sid: string | null = await getRedis().get("_id:" + receiver);

            if (sid) {
                sid = sid.split(":")[1];
                logger.info("Sid: " + sid);
                getIO()
                    .to(sid)
                    .emit(
                        getEventNameString(notification.eventName),
                        notification.message
                    );
            }
        });

        next();
    } catch (err) {
        logger.error("Error in notification middleware");
        logger.error(err);
    }
}

export default notificationMiddleware;
