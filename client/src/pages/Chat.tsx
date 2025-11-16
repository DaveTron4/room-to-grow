import { useCallback, useState } from 'react'
import { ChatAPI } from '../services/ChatAPI'
import ChatBox from '../components/ChatBox'
import ChatInput from '../components/ChatInput'
import ActivityPanel from '../components/ActivityPanel'
import FlashCardModal from '../components/FlashCardModal'
import QuizModal from '../components/QuizModal'
import HistoryPanel from '../components/HistoryPanel'
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
    const [currentChatId, setCurrentChatId] = useState<string | null>(null)
    const [historyRefreshKey, setHistoryRefreshKey] = useState(0)

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
            const data = await ChatAPI.sendChatMessage(content, history, currentChatId || undefined)
            const aiMsg: ChatMessage = {
                id: crypto.randomUUID(),
                role: 'model',
                content: data.message ?? '...',
            }
            setMessages((prev) => [...prev, aiMsg])
            
            // Update chatId if returned (for new chats)
            if (data.chatId && !currentChatId) {
                setCurrentChatId(data.chatId)
                // Refresh history panel to show new chat
                setHistoryRefreshKey(prev => prev + 1)
            }
        } catch (e: any) {
        console.error(e)
        setError(e?.message || 'Something went wrong, please try again.')
        } finally {
        setLoading(false)
        }
    }, [input, loading, messages, currentChatId])

    const handleGenerateFlashCards = useCallback(async () => {
        if (messages.length === 0) {
            setError('No conversation history to generate flash cards from.')
            return
        }

        try {
            setError(null)
            const history = messages.map((m) => ({ role: m.role, content: m.content }))
            const result = await ChatAPI.generateFlashCards(history, currentChatId || undefined)
            
            const newActivity: Activity = {
                id: result.activityId || crypto.randomUUID(),
                type: 'flashcard',
                title: result.title || `Flash Cards (${new Date().toLocaleDateString()})`,
                count: result.flashcards.length,
                data: result.flashcards
            }
            
            setActivities([newActivity, ...activities])
            setActiveModal(newActivity)
        } catch (e: any) {
            console.error(e)
            setError(e?.message || 'Failed to generate flash cards.')
        }
    }, [messages, activities, currentChatId])

    const handleGenerateQuiz = useCallback(async () => {
        if (messages.length === 0) {
            setError('No conversation history to generate quiz from.')
            return
        }

        try {
            setError(null)
            const history = messages.map((m) => ({ role: m.role, content: m.content }))
            const result = await ChatAPI.generateQuiz(history, currentChatId || undefined)
            
            const newActivity: Activity = {
                id: result.activityId || crypto.randomUUID(),
                type: 'quiz',
                title: result.title || `Quiz (${new Date().toLocaleDateString()})`,
                count: result.quiz.length,
                data: result.quiz
            }
            
            setActivities([newActivity, ...activities])
            setActiveModal(newActivity)
        } catch (e: any) {
            console.error(e)
            setError(e?.message || 'Failed to generate quiz.')
        }
    }, [messages, activities, currentChatId])

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
        setCurrentChatId(null)
    }, [])

    const handleChatSelect = useCallback(async (chatId: string) => {
        try {
            setLoading(true)
            setError(null)
            const { chat } = await ChatAPI.getChatById(chatId)
            
            // Load the messages
            const loadedMessages: ChatMessage[] = chat.messages.map((m, i) => ({
                id: `${chatId}-${i}`,
                role: m.role,
                content: m.content,
            }))
            
            setMessages(loadedMessages)
            setCurrentChatId(chatId)
            
            // Load activities for this chat
            try {
                const { activities: allActivities } = await ChatAPI.getActivities()
                const chatActivities = allActivities
                    .filter(a => a.chatId === chatId)
                    .map(a => ({
                        id: a._id,
                        type: a.type,
                        title: a.title,
                        count: Array.isArray(a.data) ? a.data.length : 0,
                        data: a.data
                    }))
                setActivities(chatActivities)
            } catch (actErr) {
                console.error('Failed to load activities:', actErr)
                setActivities([])
            }
        } catch (e: any) {
            console.error('Failed to load chat:', e)
            setError(e?.message || 'Failed to load chat.')
        } finally {
            setLoading(false)
        }
    }, [])

    const handleHistoryUpdate = useCallback(() => {
        // Called when history panel mounts/updates
        // Can be used to trigger refresh if needed
    }, [])

    return (
        <div className="h-screen flex overflow-hidden">
            {/* History Panel Sidebar */}
            <HistoryPanel 
                onChatSelect={handleChatSelect}
                currentChatId={currentChatId || undefined}
                onHistoryUpdate={handleHistoryUpdate}
                refreshKey={historyRefreshKey}
            />
            
            {/* Main chat area */}
            <div className="flex-1 flex pt-10 px-4 pb-4 gap-2">
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
                        title={activeModal.title}
                        onClose={handleCloseModal}
                    />
                )}
                {activeModal && activeModal.type === 'quiz' && (
                    <QuizModal 
                        quiz={activeModal.data}
                        title={activeModal.title}
                        onClose={handleCloseModal}
                    />
                )}
            </AnimatePresence>
        </div>
    )
}

export default Chat