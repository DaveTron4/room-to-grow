import React, { useEffect, useRef } from 'react'
import ChatMessage from './ChatMessage'

type ChatMessage = {
  id: string
  role: 'user' | 'model'
  content: string
}

type ChatBoxProps = {
  messages: ChatMessage[]
  skipAnimations?: boolean  // Skip typewriter for loaded messages
}

const ChatBox: React.FC<ChatBoxProps> = ({ messages, skipAnimations = false }) => {
  const endRef = useRef<HTMLDivElement | null>(null)
  const scrollIntervalRef = useRef<number | null>(null)

  // Auto scroll to the latest message and follow typewriter effect
  useEffect(() => {
    // Initial scroll when messages change
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
    
    // Keep scrolling during typewriter effect
    scrollIntervalRef.current = setInterval(() => {
      endRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, 100) as unknown as number
    
    // Clear interval after 5 seconds (should be enough for typewriter)
    const timeout = setTimeout(() => {
      if (scrollIntervalRef.current) {
        clearInterval(scrollIntervalRef.current)
      }
    }, 5000)
    
    return () => {
      if (scrollIntervalRef.current) {
        clearInterval(scrollIntervalRef.current)
      }
      clearTimeout(timeout)
    }
  }, [messages.length])

  return (

    <div className="chatbox-scroll flex-1 overflow-y-auto rounded-sm border border-border bg-surface px-2 min-h-0 space-y-3">
        {messages.length === 0 && (
            <p className="text-center text-text-muted mt-4">
                Start a conversation with your AI tutor. Ask anything you're studying.
            </p>
        )}

        {messages.map((m) => (
            <ChatMessage key={m.id} role={m.role} content={m.content} skipAnimation={skipAnimations} />
        ))}
        <div ref={endRef} />
    </div>

  )
}

export default ChatBox
