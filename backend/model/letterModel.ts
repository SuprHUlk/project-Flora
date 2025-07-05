import mongoose, { model } from "mongoose";

export interface ILetter {
  message: string;
  sender: string;
  receiver: string;
  pastReceiver: string[];
  createdAt: Date;
  updatedAt: Date;
  status: boolean;
  accepted: boolean;
}

export interface ILetterRequest {
  _id?: string;
  message: string;
}

export interface ILetterResponse {
  _id: string;
  message: string;
  sentDate?: Date;
  receivedDate?: Date;
}

const letterSchema = new mongoose.Schema<ILetter>(
  {
    message: { type: String, required: true },
    sender: { type: String, required: true },
    receiver: { type: String, required: true },
    pastReceiver: { type: [String] },
    status: { type: Boolean, required: true, default: true },
    accepted: { type: Boolean, required: true, default: false },
  },
  { timestamps: true }
);

const Letter = model<ILetter>("letter", letterSchema);

export default Letter;
