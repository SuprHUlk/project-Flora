import { Server, Socket } from "socket.io";
import { send as sendController } from "../controller/chatController";
import { IChatRequest, IChatResponse } from "../../model/chatModel";
import Redis from "../../database/redis";
import logger from "../../config/logger";
import { EventName, Notification } from "../../model/notificationModel";

function chatEvent(io: Server, socket: Socket, next: (...args: any) => void) {
    socket.on("chat:send", (chat: IChatRequest) => {
        send(chat, io, socket, next);
    });
}

async function send(
    chat: IChatRequest,
    io: Server,
    socket: Socket,
    next: (...arg: any) => void
) {
    try {
        logger.info("Chat Event send");
        sendController(chat, socket.user);
        let receiverSid: string | null = await (
            await Redis.getInstance()
        ).get("_id:" + chat.receiver);
        if (receiverSid) {
            logger.info("Sid: " + receiverSid);
            receiverSid = receiverSid.split(":")[1];
            const chatResponse: IChatResponse = {
                sender: socket.user._id,
                message: chat.message,
                createdAt: new Date(),
            };
            io.to(receiverSid).emit("chat:receive", chatResponse);

            const notification: Notification = {
                eventName: EventName.messageReceived,
                message: "You have a new message",
                receivers: [chat.receiver],
            };
            next(notification);
        }
    } catch (err) {
        logger.error("Error in chat Event");
        logger.error(err);
    }
}

export default chatEvent;
