// Centralized Chat API client with explicit try/catch and bottom exports
export type ChatRole = 'user' | 'model'

export type HistoryItem = {
	role: ChatRole
	content: string
}

export type ChatResponse = {
	message: string
	role: ChatRole
	chatId?: string
}

// Base URL (relative so it works behind same-origin proxy; override via Vite env if needed)
const API_BASE = (import.meta as any).env?.VITE_API_URL || ''

async function sendChatMessage(
	message: string,
	history: HistoryItem[] = [],
	chatId?: string,
	opts?: { signal?: AbortSignal }
): Promise<ChatResponse> {
	try {

        console.log('Sending chat message:', { message, history, chatId })
        console.log('API_BASE:', API_BASE)

		const res = await fetch(`${API_BASE}/api/chat`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			credentials: 'include',
			body: JSON.stringify({ message, history, chatId }),
			signal: opts?.signal,
		})

		const data = await res.json().catch(() => ({}))
		if (!res.ok) {
			throw new Error((data as any)?.error || `Request failed: ${res.status}`)
		}
		return data as ChatResponse
	} catch (error) {
		console.error('sendChatMessage error:', error)
		throw error
	}
}

async function newChat(opts?: { signal?: AbortSignal }): Promise<{ message: string; chatId: string }> {
	try {
		const res = await fetch(`${API_BASE}/api/chat/new`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			credentials: 'include',
			signal: opts?.signal,
		})

		const data = await res.json().catch(() => ({}))
		if (!res.ok) {
			throw new Error((data as any)?.error || `Request failed: ${res.status}`)
		}
		return data as { message: string; chatId: string }
	} catch (error) {
		console.error('newChat error:', error)
		throw error
	}
}

async function generateFlashCards(
	history: HistoryItem[],
	chatId?: string,
	opts?: { signal?: AbortSignal }
): Promise<{ flashcards: Array<{ question: string; answer: string }>; title?: string; activityId?: string }> {
	try {
		const res = await fetch(`${API_BASE}/api/chat/flashcards`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			credentials: 'include',
			body: JSON.stringify({ history, chatId }),
			signal: opts?.signal,
		})

		const data = await res.json().catch(() => ({}))
		if (!res.ok) {
			throw new Error((data as any)?.error || `Request failed: ${res.status}`)
		}
		return data
	} catch (error) {
		console.error('generateFlashCards error:', error)
		throw error
	}
}

async function generateQuiz(
	history: HistoryItem[],
	chatId?: string,
	opts?: { signal?: AbortSignal }
): Promise<{ quiz: Array<{ question: string; options: string[]; correctAnswer: number; explanation: string }>; title?: string; activityId?: string }> {
	try {
		const res = await fetch(`${API_BASE}/api/chat/quiz`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			credentials: 'include',
			body: JSON.stringify({ history, chatId }),
			signal: opts?.signal,
		})

		const data = await res.json().catch(() => ({}))
		if (!res.ok) {
			throw new Error((data as any)?.error || `Request failed: ${res.status}`)
		}
		return data
	} catch (error) {
		console.error('generateQuiz error:', error)
		throw error
	}
}

export type ChatHistoryItem = {
	_id: string
	title: string
	createdAt: string
	updatedAt: string
}

export type ChatDetail = {
	_id: string
	userId: string
	title: string
	messages: Array<{ role: ChatRole; content: string; timestamp: string }>
	createdAt: string
	updatedAt: string
}

export type ActivityItem = {
	_id: string
	userId: string
	chatId: string
	type: 'flashcard' | 'quiz'
	title: string
	data: any
	createdAt: string
}

async function getChatHistory(opts?: { signal?: AbortSignal }): Promise<{ chats: ChatHistoryItem[] }> {
	try {
		const res = await fetch(`${API_BASE}/api/chat/history`, {
			method: 'GET',
			headers: { 'Content-Type': 'application/json' },
			credentials: 'include',
			signal: opts?.signal,
		})

		const data = await res.json().catch(() => ({}))
		if (!res.ok) {
			throw new Error((data as any)?.error || `Request failed: ${res.status}`)
		}
		return data
	} catch (error) {
		console.error('getChatHistory error:', error)
		throw error
	}
}

async function getChatById(chatId: string, opts?: { signal?: AbortSignal }): Promise<{ chat: ChatDetail }> {
	try {
		const res = await fetch(`${API_BASE}/api/chat/${chatId}`, {
			method: 'GET',
			headers: { 'Content-Type': 'application/json' },
			credentials: 'include',
			signal: opts?.signal,
		})

		const data = await res.json().catch(() => ({}))
		if (!res.ok) {
			throw new Error((data as any)?.error || `Request failed: ${res.status}`)
		}
		return data
	} catch (error) {
		console.error('getChatById error:', error)
		throw error
	}
}

async function deleteChat(chatId: string, opts?: { signal?: AbortSignal }): Promise<{ message: string }> {
	try {
		const res = await fetch(`${API_BASE}/api/chat/${chatId}`, {
			method: 'DELETE',
			headers: { 'Content-Type': 'application/json' },
			credentials: 'include',
			signal: opts?.signal,
		})

		const data = await res.json().catch(() => ({}))
		if (!res.ok) {
			throw new Error((data as any)?.error || `Request failed: ${res.status}`)
		}
		return data
	} catch (error) {
		console.error('deleteChat error:', error)
		throw error
	}
}

async function getActivities(opts?: { signal?: AbortSignal }): Promise<{ activities: ActivityItem[] }> {
	try {
		const res = await fetch(`${API_BASE}/api/chat/activities`, {
			method: 'GET',
			headers: { 'Content-Type': 'application/json' },
			credentials: 'include',
			signal: opts?.signal,
		})

		const data = await res.json().catch(() => ({}))
		if (!res.ok) {
			throw new Error((data as any)?.error || `Request failed: ${res.status}`)
		}
		return data
	} catch (error) {
		console.error('getActivities error:', error)
		throw error
	}
}

const ChatAPI = { sendChatMessage, newChat, generateFlashCards, generateQuiz, getChatHistory, getChatById, deleteChat, getActivities }

export { sendChatMessage, newChat, generateFlashCards, generateQuiz, getChatHistory, getChatById, deleteChat, getActivities, ChatAPI }

