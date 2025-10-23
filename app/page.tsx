'use client'

import { useChat } from '@ai-sdk/react'

export default function Chat() {
  const { messages, input, handleInputChange, handleSubmit } = useChat({
    api: '/api/chat',
  })

  return (
    <main className="p-6 max-w-md mx-auto">
      <div className="space-y-2 h-96 overflow-y-auto border p-4 rounded">
        {messages.map((m) => (
          <div key={m.id}>
            <b>{m.role === 'user' ? 'You' : 'Bot'}:</b> {m.content}
          </div>
        ))}
      </div>
      <form onSubmit={handleSubmit} className="flex mt-4">
        <input
          value={input}
          onChange={handleInputChange}
          className="flex-1 border rounded px-3 py-2"
          placeholder="Type your message..."
        />
        <button type="submit" className="ml-2 bg-blue-500 text-white px-3 rounded">
          Send
        </button>
      </form>
    </main>
  )
}