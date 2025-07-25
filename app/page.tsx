'use client'

import { useEffect, useRef, useState } from 'react'
import { pusherClient } from '@/utils/pusherClient'
import { Menu, X } from 'lucide-react'

type ChatMessage = {
  user: string
  message: string
}

export default function Page() {
  const [user, setUser] = useState('')
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [onlineUsers, setOnlineUsers] = useState<string[]>([])
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const chat = pusherClient.subscribe('chat-channel')
    chat.bind('new-message', (data: ChatMessage) => {
      setMessages(prev => [...prev, data])
    })

    return () => {
      chat.unbind_all()
      pusherClient.unsubscribe('chat-channel')
    }
  }, [])

  useEffect(() => {
    if (!user) return
    const presence = pusherClient.subscribe('presence-chat') 

    type PresenceMembers = {
      members: { [id: string]: { name: string } }
    }
    type PresenceMember = {
      info: { name: string }
    }

    presence.bind('pusher:subscription_succeeded', (members: PresenceMembers) => {
      const users = Object.values(members.members).map((m) => m.name)
      setOnlineUsers(users)
    })

    presence.bind('pusher:member_added', (member: PresenceMember) => {
      setOnlineUsers(prev => [...prev, member.info.name])
    })

    presence.bind('pusher:member_removed', (member: PresenceMember) => {
      setOnlineUsers(prev => prev.filter(name => name !== member.info.name))
    })

    return () => {
      presence.unbind_all()
      pusherClient.unsubscribe('presence-chat')
    }
  }, [user])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const sendMessage = async () => {
    if (!message.trim() || !user.trim()) return
    await fetch('/api/SendMessage', {
      method: 'POST',
      body: JSON.stringify({ user, message }),
    })
    setMessage('')
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') sendMessage()
  }

  return (
    <div className="flex h-screen bg-zinc-900 text-white">
      {/* Sidebar */}
      <aside
        className={`fixed md:static z-20 bg-zinc-800 w-64 h-full p-4 transition-transform ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="flex justify-between items-center mb-4 md:hidden">
          <h2 className="text-lg font-semibold">Chat App</h2>
          <button onClick={() => setSidebarOpen(false)}><X /></button>
        </div>

        <h2 className="text-xl font-bold mb-6 hidden md:block">Chat App</h2>

        <input
          type="text"
          placeholder="Enter your name"
          value={user}
          onChange={e => setUser(e.target.value)}
          className="w-full px-3 py-2 mb-4 rounded bg-zinc-700 text-white placeholder:text-zinc-400 focus:outline-none"
        />

        <h3 className="text-sm text-zinc-400 mb-2">Online Users</h3>
        <ul className="space-y-2 text-sm">
          {onlineUsers.map((u, i) => (
            <li key={i} className={`flex items-center gap-2 ${u === user ? 'text-blue-400 font-semibold' : 'text-zinc-300'}`}>
              <span className="w-2 h-2 bg-green-500 rounded-full" />
              {u === user ? 'You' : u}
            </li>
          ))}
        </ul>
      </aside>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="flex items-center justify-between px-4 py-3 bg-zinc-800 border-b border-zinc-700">
          <button className="md:hidden" onClick={() => setSidebarOpen(true)}><Menu /></button>
          <h1 className="text-lg font-semibold">Chat Room</h1>
          <div />
        </header>

        {/* Messages */}
        <main className="flex-1 overflow-y-auto p-4 space-y-3">
          {messages.map((msg, idx) => {
            const isSelf = msg.user === user
            return (
              <div
                key={idx}
                className={`max-w-xs px-4 py-2 rounded-lg ${
                  isSelf ? 'ml-auto bg-blue-600' : 'mr-auto bg-zinc-700'
                }`}
              >
                {!isSelf && (
                  <p className="text-sm font-semibold text-zinc-300 mb-1">{msg.user}</p>
                )}
                <p className="break-words">{msg.message}</p>
              </div>
            )
          })}
          <div ref={messagesEndRef} />
        </main>

        {/* Input */}
        <footer className="flex gap-2 p-4 border-t border-zinc-700 bg-zinc-800">
          <input
            type="text"
            placeholder="Type a message..."
            value={message}
            onChange={e => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 px-4 py-2 rounded bg-zinc-700 text-white placeholder:text-zinc-400 focus:outline-none"
          />
          <button
            onClick={sendMessage}
            className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded"
          >
            Send
          </button>
        </footer>
      </div>
    </div>
  )
}
