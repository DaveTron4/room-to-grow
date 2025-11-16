import React, { useState, useEffect, useRef } from 'react'
import { motion } from 'motion/react'
import ReactMarkdown from 'react-markdown'
import { Volume2, VolumeX, Loader2 } from 'lucide-react'

type ChatMessageProps = {
  role: 'user' | 'model'
  content: string
}

const ChatMessage: React.FC<ChatMessageProps> = ({ role, content }) => {
  const [displayedContent, setDisplayedContent] = useState('')
  const [isTyping, setIsTyping] = useState(role === 'model')
  const [isPlayingAudio, setIsPlayingAudio] = useState(false)
  const [isLoadingAudio, setIsLoadingAudio] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)

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

  const handlePlayAudio = async () => {
    if (isPlayingAudio) {
      // Stop audio
      audioRef.current?.pause()
      audioRef.current = null
      setIsPlayingAudio(false)
      return
    }

    try {
      setIsLoadingAudio(true)
      
      const response = await fetch('http://localhost:5000/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ text: content })
      })

      if (!response.ok) {
        throw new Error('Failed to generate audio')
      }

      const audioBlob = await response.blob()
      const audioUrl = URL.createObjectURL(audioBlob)
      
      const audio = new Audio(audioUrl)
      audioRef.current = audio
      
      audio.onended = () => {
        setIsPlayingAudio(false)
        URL.revokeObjectURL(audioUrl)
      }

      audio.onerror = () => {
        setIsPlayingAudio(false)
        setIsLoadingAudio(false)
        URL.revokeObjectURL(audioUrl)
      }

      await audio.play()
      setIsPlayingAudio(true)
      setIsLoadingAudio(false)
    } catch (error) {
      console.error('Failed to play audio:', error)
      setIsLoadingAudio(false)
    }
  }

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
            : 'max-w-[85%] rounded-sm px-2 py-1 bg-ai-msg border border-ai-msg-border text-text relative group'
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
        
        {/* Audio control button for AI messages */}
        {role === 'model' && !isTyping && (
          <button
            onClick={handlePlayAudio}
            disabled={isLoadingAudio}
            className="absolute top-1 right-1 p-0.5 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-surface rounded-full"
            title={isPlayingAudio ? 'Stop audio' : 'Play audio'}
          >
            {isLoadingAudio ? (
              <Loader2 className="w-1 h-1 text-text-muted animate-spin" />
            ) : isPlayingAudio ? (
              <VolumeX className="w-1 h-1 text-primary" />
            ) : (
              <Volume2 className="w-1 h-1 text-text-muted hover:text-primary" />
            )}
          </button>
        )}
      </div>
    </motion.div>
  )
}

export default ChatMessage
