import React, { useEffect, useRef } from 'react'
import ChatMessage from './ChatMessage'

type ChatMessage = {
  id: string
  role: 'user' | 'model'
  content: string
}

type ChatBoxProps = {
  messages: ChatMessage[]
}

const ChatBox: React.FC<ChatBoxProps> = ({ messages }) => {
  const endRef = useRef<HTMLDivElement | null>(null)

  // Auto scroll to the latest message
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages.length])

  return (
    <div className="flex-1 overflow-y-auto rounded-sm border border-border bg-surface p-4 min-h-0 space-y-3">
      {messages.length === 0 && (
        <p className="text-center text-text-muted mt-4">
          Start a conversation with your AI tutor. Ask anything you're studying.
        </p>
      )}

      {messages.map((m) => (
        <ChatMessage key={m.id} role={m.role} content={m.content} />
      ))}
      <div ref={endRef} />
    </div>
  )
}

export default ChatBox
