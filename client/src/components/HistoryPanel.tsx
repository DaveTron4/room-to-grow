import { useEffect, useState } from 'react'
import { ChatAPI } from '../services/ChatAPI'
import type { ChatHistoryItem } from '../services/ChatAPI'
import { Trash2, Loader2 } from 'lucide-react'
import { motion, AnimatePresence } from 'motion/react'

type HistoryPanelProps = {
	onChatSelect: (chatId: string) => void
	currentChatId?: string
	onHistoryUpdate: () => void
	refreshKey?: number
}

const HistoryPanel = ({ onChatSelect, currentChatId, onHistoryUpdate, refreshKey }: HistoryPanelProps) => {
	const [chats, setChats] = useState<ChatHistoryItem[]>([])
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)
	const [deletingId, setDeletingId] = useState<string | null>(null)

	const loadHistory = async () => {
		try {
			setLoading(true)
			setError(null)
			const data = await ChatAPI.getChatHistory()
			setChats(data.chats)
		} catch (e: any) {
			console.error('Failed to load chat history:', e)
			setError('Failed to load history')
		} finally {
			setLoading(false)
		}
	}

	useEffect(() => {
		loadHistory()
	}, [refreshKey])

	// Expose refresh to parent via callback
	useEffect(() => {
		onHistoryUpdate()
	}, [])

	const handleDelete = async (e: React.MouseEvent, chatId: string) => {
		e.stopPropagation()
		if (!confirm('Delete this chat?')) return

		try {
			setDeletingId(chatId)
			await ChatAPI.deleteChat(chatId)
			setChats(chats.filter(c => c._id !== chatId))
			
			// If we deleted the current chat, notify parent
			if (currentChatId === chatId) {
				// Parent should handle clearing current chat
			}
		} catch (e: any) {
			console.error('Failed to delete chat:', e)
			alert('Failed to delete chat')
		} finally {
			setDeletingId(null)
		}
	}

	return (
		<div className="w-20 border-r border-border bg-surface flex flex-col h-full">
			<div className="px-1 py-1 mt-6 border-b border-border">
				<h2 className="text-lg font-semibold text-text">Chat History</h2>
			</div>

			<div className="flex-1 overflow-y-auto p-1">
				{loading && (
					<div className="flex items-center justify-center py-8">
						<Loader2 className="w-5 h-5 animate-spin text-text-secondary" />
					</div>
				)}

				{error && (
					<div className="p-4 text-sm text-red-400 text-center">
						{error}
					</div>
				)}

				{!loading && !error && chats.length === 0 && (
					<div className="p-4 text-sm text-text-secondary text-center">
						No chat history yet
					</div>
				)}

				<AnimatePresence>
					{chats.map((chat) => (
						<motion.button
							key={chat._id}
							onClick={() => onChatSelect(chat._id)}
							className={`w-full text-left p-0.5 rounded-full mb-0.5 transition-colors group relative ${
								currentChatId === chat._id
									? 'bg-primary/10 text-primary'
									: 'hover:bg-surface-hover text-text'
							}`}
							initial={{ opacity: 0, y: -10 }}
							animate={{ opacity: 1, y: 0 }}
							exit={{ opacity: 0, x: -10 }}
							transition={{ duration: 0.2 }}
						>
							<div className="flex items-center gap-1">
								<div className="flex-1 min-w-0 ">
									<p className="ml-0.5 text-sm font-light truncate">
										{chat.title}
									</p>
									{/* <p className="text-xs text-text-secondary mt-0.5">
										{formatDate(chat.updatedAt)}
									</p> */}
								</div>
								<button
									onClick={(e) => handleDelete(e, chat._id)}
									disabled={deletingId === chat._id}
									className="opacity-0 group-hover:opacity-100 transition-text p-0.5 rounded-full"
								>
									{deletingId === chat._id ? (
										<Loader2 className="w-1 h-1 animate-spin text-white hover:text-red-400" />
									) : (
										<Trash2 className="w-1 h-1 text-white hover:text-red-400" />
									)}
								</button>
							</div>
						</motion.button>
					))}
				</AnimatePresence>
			</div>
		</div>
	)
}

export default HistoryPanel
