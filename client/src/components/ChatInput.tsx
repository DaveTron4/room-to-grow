import React from 'react'
import {Send} from 'lucide-react';

type ChatInputProps = {
  input: string
  loading: boolean
  error: string | null
  onInputChange: (value: string) => void
  onSendMessage: () => void
}

const ChatInput: React.FC<ChatInputProps> = ({ 
  input, 
  loading, 
  error, 
  onInputChange, 
  onSendMessage 
}) => {
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
        <div className="flex items-stretch gap-1">
            <textarea
                className="flex-1 resize-none rounded-sm bg-input-bg border border-input-border focus:border-input-border-focus outline-none px-2 py-1 text-input-text placeholder:text-input-placeholder"
                placeholder="Type your message..."
                value={input}
                onChange={(e) => onInputChange(e.target.value)}
                onKeyDown={onKeyDown}
                rows={1}
            />
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
        <div className="mt-1 text-xs text-text-subtle">Press Enter to send, Shift+Enter for a new line</div>
    </div>
  )
}

export default ChatInput
