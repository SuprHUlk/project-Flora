import mongoose from "mongoose";

interface IChat {
    sender: string;
    receiver: string;
    message: string;
    createdAt: Date;
    updatedAt: Date;
}

interface IChatRequest {
    receiver: string;
    message: string;
}

interface IChatResponse {
    _id?: string;
    sender: string;
    message: string;
    createdAt?: Date;
}

const chatSchema = new mongoose.Schema<IChat>(
    {
        sender: { type: String, require: true },
        receiver: { type: String, required: true },
        message: { type: String, required: true },
    },
    { timestamps: true }
);

const Chat = mongoose.model<IChat>("chat", chatSchema);

export { Chat, IChat, IChatRequest, IChatResponse };
