import React, { useState, useEffect, useRef } from 'react'
import { Send, Mic, MicOff, Image, X } from 'lucide-react'

type ChatInputProps = {
  input: string
  loading: boolean
  error: string | null
  onInputChange: (value: string) => void
  onSendMessage: () => void
  onImageSelect?: (image: File) => void
  selectedImage?: File | null
  onImageRemove?: () => void
}

const ChatInput: React.FC<ChatInputProps> = ({ 
  input, 
  loading, 
  error, 
  onInputChange, 
  onSendMessage,
  onImageSelect,
  selectedImage,
  onImageRemove
}) => {
  const [isListening, setIsListening] = useState(false)
  const [speechSupported, setSpeechSupported] = useState(false)
  const recognitionRef = useRef<any>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleImageClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file && file.type.startsWith('image/')) {
      onImageSelect?.(file)
    }
  }

  useEffect(() => {
    // Check if speech recognition is supported
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    if (SpeechRecognition) {
      setSpeechSupported(true)
      
      const recognition = new SpeechRecognition()
      recognition.continuous = true
      recognition.interimResults = true
      recognition.lang = 'en-US'

      recognition.onresult = (event: any) => {
        let interimTranscript = ''
        let finalTranscript = ''

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript
          if (event.results[i].isFinal) {
            finalTranscript += transcript + ' '
          } else {
            interimTranscript += transcript
          }
        }

        if (finalTranscript) {
          onInputChange(input + finalTranscript)
        }
      }

      recognition.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error)
        setIsListening(false)
      }

      recognition.onend = () => {
        setIsListening(false)
      }

      recognitionRef.current = recognition
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop()
      }
    }
  }, [input, onInputChange])

  const toggleListening = () => {
    if (!recognitionRef.current) return

    if (isListening) {
      recognitionRef.current.stop()
      setIsListening(false)
    } else {
      recognitionRef.current.start()
      setIsListening(true)
    }
  }

  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      onSendMessage()
    }
  }

  return (
    <div className="rounded-sm border border-border bg-surface p-2">
        {error && (
            <div className="mb-2 text-sm text-error">
                {error}
            </div>
        )}
        
        {/* Image preview */}
        {selectedImage && (
          <div className="relative inline-block">
            <img 
              src={URL.createObjectURL(selectedImage)} 
              alt="Selected" 
              className="w-5 rounded-sm border border-border"
            />
            <button
              onClick={onImageRemove}
              className="glass-close absolute top-0 right-0 p-0.5 text-white rounded-full"
              title="Remove image"
            >
              <X className="w-1 h-1" />
            </button>
          </div>
        )}
        
        <div className="flex items-stretch gap-1">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
            
            <textarea
                className="flex-1 resize-none rounded-sm bg-input-bg border border-input-border focus:border-input-border-focus outline-none px-2 py-1 text-input-text placeholder:text-input-placeholder"
                placeholder={selectedImage ? "Ask about this image..." : "Type your message..."}
                value={input}
                onChange={(e) => onInputChange(e.target.value)}
                onKeyDown={onKeyDown}
                rows={1}
            />
            
            <button
              onClick={handleImageClick}
              disabled={loading}
              className="shrink-0 px-1 rounded-sm bg-surface-hover hover:bg-surface-hover/80 text-text transition-colors flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
              title="Upload image"
            >
              <Image className="h-1 w-1" />
            </button>
            
            {speechSupported && (
              <button
                onClick={toggleListening}
                disabled={loading}
                className={`shrink-0 px-1 rounded-sm transition-colors flex items-center justify-center ${
                  isListening 
                    ? 'bg-error hover:bg-error/80 text-white' 
                    : 'bg-surface-hover hover:bg-surface-hover/80 text-text'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
                title={isListening ? 'Stop recording' : 'Start voice input'}
              >
                {isListening ? (
                  <MicOff className="h-1 w-1 animate-pulse" />
                ) : (
                  <Mic className="h-1 w-1" />
                )}
              </button>
            )}

            <button
                onClick={onSendMessage}
                disabled={loading || input.trim().length === 0}
                className="shrink-0 px-1 rounded-sm bg-primary hover:bg-btn-primary-hover text-btn-primary-text disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
            >
                {loading ? (
                    <div className="flex gap-0.5">
                        <div className="w-0.5 h-0.5 bg-btn-primary-text rounded-full" style={{ animation: 'wave-pulse 1.4s ease-in-out infinite' }}></div>
                        <div className="w-0.5 h-0.5 bg-btn-primary-text rounded-full" style={{ animation: 'wave-pulse 1.4s ease-in-out 0.2s infinite' }}></div>
                        <div className="w-0.5 h-0.5 bg-btn-primary-text rounded-full" style={{ animation: 'wave-pulse 1.4s ease-in-out 0.4s infinite' }}></div>
                    </div>
                ) : (
                    <Send className="h-1 w-1" />
                )}
            </button>
        </div>
        <div className="mt-1 text-xs text-text-subtle">
          Press Enter to send, Shift+Enter for a new line
          {speechSupported && <span> • Click mic to use voice input</span>}
          <span> • Click image icon to upload a photo</span>
        </div>
    </div>
  )
}

export default ChatInput
