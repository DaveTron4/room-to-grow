import { useCallback, useState } from 'react'
import { ChatAPI } from '../services/ChatAPI'
import ChatBox from '../components/ChatBox'
import ChatInput from '../components/ChatInput'
import ActivityPanel from '../components/ActivityPanel'
import FlashCardModal from '../components/FlashCardModal'
import QuizModal from '../components/QuizModal'
import { AnimatePresence } from 'motion/react'

type ChatMessage = {
  id: string
  role: 'user' | 'model'
  content: string
}

type Activity = {
  id: string
  type: 'flashcard' | 'quiz'
  title: string
  count: number
  data: any
}

const Chat = () => {
    const [messages, setMessages] = useState<ChatMessage[]>([])
    const [input, setInput] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [activities, setActivities] = useState<Activity[]>([])
    const [activeModal, setActiveModal] = useState<Activity | null>(null)

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

    const handleGenerateFlashCards = useCallback(async () => {
        if (messages.length === 0) {
            setError('No conversation history to generate flash cards from.')
            return
        }

        try {
            setError(null)
            const history = messages.map((m) => ({ role: m.role, content: m.content }))
            const result = await ChatAPI.generateFlashCards(history)
            
            const newActivity: Activity = {
                id: crypto.randomUUID(),
                type: 'flashcard',
                title: `Flash Cards (${new Date().toLocaleDateString()})`,
                count: result.flashcards.length,
                data: result.flashcards
            }
            
            setActivities([newActivity, ...activities])
            setActiveModal(newActivity)
        } catch (e: any) {
            console.error(e)
            setError(e?.message || 'Failed to generate flash cards.')
        }
    }, [messages, activities])

    const handleGenerateQuiz = useCallback(async () => {
        if (messages.length === 0) {
            setError('No conversation history to generate quiz from.')
            return
        }

        try {
            setError(null)
            const history = messages.map((m) => ({ role: m.role, content: m.content }))
            const result = await ChatAPI.generateQuiz(history)
            
            const newActivity: Activity = {
                id: crypto.randomUUID(),
                type: 'quiz',
                title: `Quiz (${new Date().toLocaleDateString()})`,
                count: result.quiz.length,
                data: result.quiz
            }
            
            setActivities([newActivity, ...activities])
            setActiveModal(newActivity)
        } catch (e: any) {
            console.error(e)
            setError(e?.message || 'Failed to generate quiz.')
        }
    }, [messages, activities])

    const handleActivityClick = (activity: Activity) => {
        setActiveModal(activity)
    }

    const handleActivityDelete = (id: string) => {
        setActivities(activities.filter(a => a.id !== id))
        if (activeModal?.id === id) {
            setActiveModal(null)
        }
    }

    const handleCloseModal = () => {
        setActiveModal(null)
    }

    const handleNewChat = useCallback(() => {
        setMessages([])
        setActivities([])
        setError(null)
    }, [])

    return (
        <div className="h-screen flex overflow-hidden">
            {/* Future: Sidebar for chat history will go here */}
            {/* <div className="w-20 border-r border-border bg-surface">Sidebar</div> */}
            
            {/* Main chat area */}
            <div className="flex-1 flex pt-10 px-4 pb-4">
                <div className="max-w-6xl w-full mx-auto flex flex-col h-full gap-2">
                    {/* Buttons above chatbox */}
                    <div className="flex justify-between gap-2 shrink-0">
                        <div className="flex gap-2">
                            <button 
                                onClick={handleGenerateFlashCards}
                                disabled={messages.length === 0}
                                className="glass hover:bg-btn-generative text-btn-generative-text px-2 py-1 rounded-sm text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Generate Flash Cards
                            </button>
                            <button 
                                onClick={handleGenerateQuiz}
                                disabled={messages.length === 0}
                                className="glass hover:bg-btn-generative text-btn-generative-text px-2 py-1 rounded-sm text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Generate Quiz
                            </button>
                        </div>
                        <button className="glass-dark hover:bg-btn-new-chat text-btn-new-chat-text px-2 py-1 rounded-sm text-sm transition-colors" onClick={handleNewChat}>
                            New Chat
                        </button>
                    </div>

                    {/* Chat and Activity Panel - side by side */}
                    <div className="flex-1 flex gap-4 min-h-0">
                        {/* Chat Section */}
                        <div className="flex-1 flex flex-col gap-2 min-h-0">
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
                {/* Activity Panel */}
                <div className="w-20 border-l border-border pl-4 overflow-y-auto">
                    <ActivityPanel 
                        activities={activities}
                        onActivityClick={handleActivityClick}
                        onActivityDelete={handleActivityDelete}
                    />
                </div>
            </div>

            {/* Modals */}
            <AnimatePresence>
                {activeModal && activeModal.type === 'flashcard' && (
                    <FlashCardModal 
                        flashcards={activeModal.data}
                        onClose={handleCloseModal}
                    />
                )}
                {activeModal && activeModal.type === 'quiz' && (
                    <QuizModal 
                        quiz={activeModal.data}
                        onClose={handleCloseModal}
                    />
                )}
            </AnimatePresence>
        </div>
    )
}

export default Chat