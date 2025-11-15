import React, { useCallback, useEffect, useRef, useState } from 'react'
import { ChatAPI } from '../services/ChatAPI'

type ChatMessage = {
  id: string
  role: 'user' | 'model'
  content: string
}

const Chat = () => {
    const [messages, setMessages] = useState<ChatMessage[]>([])
    const [input, setInput] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const endRef = useRef<HTMLDivElement | null>(null)


    // Auto scroll to the latest message
    useEffect(() => {
        endRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [messages.length])

    const sendMessage = useCallback(async () => {
        const content = input.trim()
        if (!content || loading) return

        setError(null)
        setLoading(true)

        const userMsg: ChatMessage = {
            id: crypto.randomUUID(),
            role: 'user',
            content,
        }

        // Optimistically add the user message
        setMessages((prev) => [...prev, userMsg])
        setInput('')

        try {
            // Transform history to match backend expectation and call service
            const history = [...messages, userMsg].map((m) => ({ role: m.role, content: m.content }))
            const data = await ChatAPI.sendChatMessage(content, history)
            const aiMsg: ChatMessage = {
                id: crypto.randomUUID(),
                role: 'model',
                content: data.message ?? '...',
            }
            setMessages((prev) => [...prev, aiMsg])
        } catch (e: any) {
        console.error(e)
        setError(e?.message || 'Something went wrong, please try again.')
        } finally {
        setLoading(false)
        }
    }, [input, loading, messages])

    const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            sendMessage()
        }
    }

    return (
        <div className="min-h-screen flex flex-col justify-center items-center text-center gap-2 relative overflow-hidden">
            {/* spacer for fixed nav height */}
            <div className="mx-auto flex flex-col">
                {/* Chat window */}
                <div className="flex-1 overflow-y-auto rounded-sm border border-border bg-surface p-2 space-y-2">
                {messages.length === 0 && (
                    <div className="text-center text-text-muted mt-2">
                        Start a conversation with your AI tutor. Ask anything you're studying.
                    </div>
                )}

                {messages.map((m) => (
                    <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div
                            className={
                            m.role === 'user'
                                ? 'max-w-[85%] rounded-sm px-2 py-1 bg-user-msg text-text'
                                : 'max-w-[85%] rounded-sm px-2 py-1 bg-ai-msg border border-ai-msg-border text-text'
                            }
                        >
                            {m.content}
                        </div>
                    </div>
                ))}
                <div ref={endRef} />
                </div>

                {/* Composer */}
                <div className="mt-2 rounded-sm border border-border bg-surface p-2">
                    {error && (
                        <div className="mb-2 text-sm text-error">
                        {error}
                        </div>
                    )}
                    <div className="flex items-end gap-2">
                        <textarea
                            className="flex-1 resize-none rounded-sm bg-input-bg border border-input-border focus:border-input-border-focus outline-none px-2 py-1 text-input-text placeholder:text-input-placeholder min-h-12"
                            placeholder="Type your message..."
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={onKeyDown}
                            rows={2}
                        />
                        <button
                            onClick={sendMessage}
                            disabled={loading || input.trim().length === 0}
                            className="shrink-0 h-10 px-2 rounded-sm bg-primary hover:bg-btn-primary-hover text-btn-primary-text disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                        {loading ? 'Sending…' : 'Send'}
                        </button>
                    </div>
                    <div className="mt-2 text-xs text-text-subtle">Press Enter to send, Shift+Enter for a new line</div>
                </div>
            </div>
        </div>
    )
}

export default Chat