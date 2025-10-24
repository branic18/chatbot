'use client'

import { useState } from 'react'
import { useChat } from '@ai-sdk/react'

export default function Chat() {
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const chat = useChat() // just returns empty messages state in this version

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return

    const userMessage = { role: 'user', content: input }
    setMessages((prev) => [...prev, userMessage])
    setInput('')
    setLoading(true)

    // call your API route
    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages: [...messages, userMessage] }),
    })
    const reader = res.body?.getReader()
    const botMessage = { role: 'assistant', content: '' }

    if (reader) {
      const decoder = new TextDecoder()
      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        botMessage.content += decoder.decode(value)
        setMessages((prev) => [...prev.slice(0, prev.length), botMessage])
      }
    }

    setLoading(false)
  }

  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-8">
      <div className="w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4 text-center">💬 My Chatbot</h1>
        <div className="border rounded p-4 h-96 overflow-y-auto bg-gray-50">
          {messages.map((m, idx) => (
            <div key={idx} className="mb-2">
              <b>{m.role === 'user' ? 'You' : 'Bot'}:</b> {m.content}
            </div>
          ))}
        </div>
        <form onSubmit={handleSubmit} className="mt-4 flex">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Say something..."
            className="flex-1 border rounded px-3 py-2"
            disabled={loading}
          />
          <button
            type="submit"
            className="ml-2 px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-400"
            disabled={loading}
          >
            Send
          </button>
        </form>
      </div>
    </main>
  )
}
