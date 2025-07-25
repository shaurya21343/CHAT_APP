// app/api/message/route.ts
import { NextResponse } from 'next/server';
import { pusherServer } from '@/utils/pusherServer';
import { ChatMessage } from '@/types/message';

export async function POST(req: Request) {
  const body = (await req.json()) as ChatMessage;

  if (!body.user || !body.message) {
    return NextResponse.json({ success: false }, { status: 400 });
  }

  await pusherServer.trigger('chat-channel', 'new-message', body);

  return NextResponse.json({ success: true });
}
