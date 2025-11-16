import React, { useState, useEffect, useRef } from 'react'
import { motion } from 'motion/react'
import ReactMarkdown from 'react-markdown'
import { Volume2, VolumeX, Loader2 } from 'lucide-react'

type ChatMessageProps = {
  role: 'user' | 'model'
  content: string
  skipAnimation?: boolean  // Skip typewriter for loaded messages
}

const ChatMessage: React.FC<ChatMessageProps> = ({ role, content }) => {
  const [displayedContent, setDisplayedContent] = useState(content)
  const [isPlayingAudio, setIsPlayingAudio] = useState(false)
  const [isLoadingAudio, setIsLoadingAudio] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  // Update content when it changes (for streaming)
  useEffect(() => {
    setDisplayedContent(content)
  }, [content])

  const handlePlayAudio = async () => {
    if (isPlayingAudio) {
      // Stop audio
      if (window.speechSynthesis.speaking) {
        window.speechSynthesis.cancel()
      }
      audioRef.current?.pause()
      audioRef.current = null
      setIsPlayingAudio(false)
      return
    }

    try {
      setIsLoadingAudio(true)
      
      // Use browser's built-in speech synthesis as fallback
      if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(content)
        utterance.rate = 0.9
        utterance.pitch = 1
        utterance.volume = 1
        
        utterance.onend = () => {
          setIsPlayingAudio(false)
          setIsLoadingAudio(false)
        }
        
        utterance.onerror = () => {
          setIsPlayingAudio(false)
          setIsLoadingAudio(false)
        }
        
        window.speechSynthesis.speak(utterance)
        setIsPlayingAudio(true)
        setIsLoadingAudio(false)
        return
      }
      
      // Fallback to ElevenLabs (will fail with current account status)
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000'
      const response = await fetch(`${apiUrl}/api/tts`, {
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
        {role === 'model' && displayedContent.length > 0 && (
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
