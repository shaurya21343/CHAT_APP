import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/library/db/connect";
import Message from "@/library/db/schema/message-schema";
import { ChatMessage } from "@/types/message";

export async function GET(req: NextRequest) {
  await connectDB();

  const messages = await Message.find().sort({ createdAt: -1 }).limit(100).exec();

  const formattedMessages: ChatMessage[] = messages.map((msg) => ({
    user: msg.user,
    message: msg.message,
    timestamp: msg.createdAt.toISOString(),
  }));

  return NextResponse.json(formattedMessages);
}