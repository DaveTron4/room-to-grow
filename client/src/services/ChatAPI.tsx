// Centralized Chat API client with explicit try/catch and bottom exports
export type ChatRole = 'user' | 'model'

export type HistoryItem = {
	role: ChatRole
	content: string
}

export type ChatResponse = {
	message: string
	role: ChatRole
}

// Base URL (relative so it works behind same-origin proxy; override via Vite env if needed)
const API_BASE = (import.meta as any).env?.VITE_API_URL || ''

async function sendChatMessage(
	message: string,
	history: HistoryItem[] = [],
	opts?: { signal?: AbortSignal }
): Promise<ChatResponse> {
	try {

        console.log('Sending chat message:', { message, history })
        console.log('API_BASE:', API_BASE)

		const res = await fetch(`${API_BASE}/api/chat`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ message, history }),
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

const ChatAPI = { sendChatMessage, newChat }

export { sendChatMessage, newChat, ChatAPI }

