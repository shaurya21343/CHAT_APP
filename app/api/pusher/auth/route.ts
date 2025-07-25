import { NextRequest, NextResponse } from 'next/server'
import { pusherServer } from '@/utils/pusherServer'
import { nanoid } from 'nanoid'

export async function POST(req: NextRequest) {
  const formData = await req.formData()
  const socket_id = formData.get('socket_id') as string
  const channel_name = formData.get('channel_name') as string

  const randomUsername = `user-${nanoid(6)}` // or get from cookie/session/etc.

  const auth = pusherServer.authorizeChannel(socket_id, channel_name, {
    user_id: randomUsername,
    user_info: {
      name: randomUsername,
    },
  })

  return NextResponse.json(auth)
}
