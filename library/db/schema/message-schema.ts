import mongoose, { Schema, Document } from "mongoose";

export interface IMessage extends Document {
    user: string;
    message: string;
    createdAt: Date;
    updatedAt?: Date;
}

const MessageSchema: Schema = new Schema<IMessage>(
    {
        user: { type: String, required: true },
        message: { type: String, required: true },
    },
    { timestamps: { createdAt: true, updatedAt: true } }
);
export default mongoose.models.Message || mongoose.model<IMessage>("Message", MessageSchema);