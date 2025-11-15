import React, { useCallback, useState } from 'react'
import { ChatAPI } from '../services/ChatAPI'
import ChatBox from '../components/ChatBox'
import ChatInput from '../components/ChatInput'

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

    return (
        <div className="min-h-screen flex">
            {/* Future: Sidebar for chat history will go here */}
            {/* <div className="w-64 border-r border-border bg-surface">Sidebar</div> */}
            
            {/* Main chat area */}
            <div className="flex-1 flex flex-col h-screen p-4">
                <div className="max-w-4xl w-full mx-auto flex flex-col h-full gap-4">
                    <ChatBox messages={messages} />
                    <ChatInput 
                        input={input}
                        loading={loading}
                        error={error}
                        onInputChange={setInput}
                        onSendMessage={sendMessage}
                    />
                </div>
            </div>
        </div>
    )
}

export default Chat