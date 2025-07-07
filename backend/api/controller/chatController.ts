import logger from "../../config/logger";
import { IChatRequest, Chat, IChat } from "../../model/chatModel";
import { Response } from "../../model/responseModel";
import { IUser } from "../../model/userModel";

async function send(chatRequest: IChatRequest, user: IUser): Promise<Response> {
    try {
        const chat = new Chat({
            message: chatRequest.message,
            receiver: chatRequest.receiver,
            sender: user._id?.toString(),
        });
        await chat.save();
        return { status: 200, json: { msg: "Message sent" } };
    } catch (err) {
        return { status: 500, json: err };
    }
}

async function get(friend: string, user: IUser): Promise<Response> {
    try {
        const chats = await Chat.find({
            $or: [
                { sender: user._id, receiver: friend },
                { sender: friend, receiver: user._id },
            ],
        })
            .sort({ createdAt: 1 })
            .limit(50);

        logger.info("Chats", chats);
        return { status: 200, json: chats };
    } catch (err) {
        return { status: 500, json: err };
    }
}

export { send, get };
