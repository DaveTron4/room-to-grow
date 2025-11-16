import React, { useState, useEffect } from 'react'
import { motion } from 'motion/react'
import ReactMarkdown from 'react-markdown'

type ChatMessageProps = {
  role: 'user' | 'model'
  content: string
}

const ChatMessage: React.FC<ChatMessageProps> = ({ role, content }) => {
  const [displayedContent, setDisplayedContent] = useState('')
  const [isTyping, setIsTyping] = useState(role === 'model')

  // Typewriter effect for AI messages
  useEffect(() => {
    if (role === 'model') {
      setDisplayedContent('')
      setIsTyping(true)
      let currentIndex = 0
      
      const interval = setInterval(() => {
        if (currentIndex < content.length) {
          setDisplayedContent(content.slice(0, currentIndex + 1))
          currentIndex++
        } else {
          setIsTyping(false)
          clearInterval(interval)
        }
      }, 10)

      return () => clearInterval(interval)
    } else {
      setDisplayedContent(content)
    }
  }, [content, role])

  return (
    <motion.div 
      className={`flex mt-2 ${role === 'user' ? 'justify-end text-right' : 'justify-start text-left'}`}
      initial={{ opacity: 0, scale: 0.8, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ 
        type: 'spring',
        stiffness: 500,
        damping: 30,
        mass: 1
      }}
    >
      <div
        className={
          role === 'user'
            ? 'max-w-[85%] rounded-sm px-2 py-1 bg-user-msg text-text'
            : 'max-w-[85%] rounded-sm px-2 py-1 bg-ai-msg border border-ai-msg-border text-text'
        }
      >
        <div className={`prose prose-sm max-w-none ${role === 'user' ? 'text-right' : 'text-left'}`}>
          <ReactMarkdown
            components={{
              p: ({ children }: any) => <p className="mb-2 last:mb-0">{children}</p>,
              ul: ({ children }: any) => <ul className="list-disc ml-4 mb-2">{children}</ul>,
              ol: ({ children }: any) => <ol className="list-decimal ml-4 mb-2">{children}</ol>,
              li: ({ children }: any) => <li className="mb-1">{children}</li>,
              code: ({ children, className }: any) => {
                const isInline = !className
                return isInline ? (
                  <code className="bg-surface px-1 py-0.5 rounded text-sm font-mono">{children}</code>
                ) : (
                  <code className="block bg-surface p-2 rounded text-sm font-mono overflow-x-auto my-2">{children}</code>
                )
              },
              pre: ({ children }: any) => <pre className="bg-surface p-2 rounded my-2 overflow-x-auto">{children}</pre>,
              strong: ({ children }: any) => <strong className="font-semibold">{children}</strong>,
              em: ({ children }: any) => <em className="italic">{children}</em>,
              h1: ({ children }: any) => <h1 className="text-lg font-bold mb-2">{children}</h1>,
              h2: ({ children }: any) => <h2 className="text-base font-bold mb-2">{children}</h2>,
              h3: ({ children }: any) => <h3 className="text-sm font-bold mb-1">{children}</h3>,
            }}
          >
            {displayedContent}
          </ReactMarkdown>
        </div>
        {/* {isTyping && <div className="inline-block w-0.5 h-2 ml-1 bg-accent-1 animate-pulse"></div>} */}
      </div>
    </motion.div>
  )
}

export default ChatMessage
