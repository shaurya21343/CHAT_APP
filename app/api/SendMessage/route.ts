// app/api/message/route.ts
import { NextResponse } from 'next/server';
import { pusherServer } from '@/utils/pusherServer';
import { ChatMessage } from '@/types/message';
import connectDB from '@/library/db/connect';
import  Message  from '@/library/db/schema/message-schema';

export async function POST(req: Request) {
  const body = (await req.json()) as ChatMessage;

  if (!body.user || !body.message) {
    return NextResponse.json({ success: false }, { status: 400 });
  }
  await connectDB();

  await pusherServer.trigger('chat-channel', 'new-message', body);

  const message = new Message({
    user: body.user,
    message: body.message,
  });

  await message.save();

  return NextResponse.json({ success: true });
}
