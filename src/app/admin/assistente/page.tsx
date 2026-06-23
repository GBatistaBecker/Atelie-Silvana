'use client'

import { useState, useRef, useEffect } from 'react'
import { Send, Bot, User, Loader2 } from 'lucide-react'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
}

export default function AssistenteIA() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: 'Olá, Silvana! Sou seu assistente de gestão. Você pode me perguntar sobre os pedidos pendentes, faturamento dos últimos 30 dias, vendas canceladas, entre outros dados do Ateliê. Como posso ajudar agora?'
    }
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!input.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim()
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    try {
      const res = await fetch('/api/admin-ai', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ prompt: userMessage.content })
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Erro desconhecido ao falar com o assistente.')
      }

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.reply
      }

      setMessages(prev => [...prev, assistantMessage])
    } catch (error: any) {
      console.error(error)
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `Ops, tive um problema de conexão: ${error.message}`
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col bg-[#ECE1D9] border border-[#DDD0C2] rounded-xl shadow-sm overflow-hidden">
      
      {/* Header */}
      <div className="bg-[#F3EAE5] border-b border-[#DDD0C2] p-4 flex items-center gap-3">
        <div className="bg-[#B28F76] p-2 rounded-lg text-white">
          <Bot size={24} />
        </div>
        <div>
          <h2 className="font-heading font-bold text-lg text-[#B28F76] leading-tight">Assistente IA</h2>
          <p className="text-sm text-[#B28F76]/80">Tire dúvidas rápidas sobre as métricas do Ateliê</p>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
        {messages.map((msg) => (
          <div 
            key={msg.id} 
            className={`flex w-full ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`flex gap-3 max-w-[85%] sm:max-w-[70%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
              
              {/* Avatar */}
              <div className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                msg.role === 'user' 
                  ? 'bg-[#B28F76] text-[#F3EAE5]' 
                  : 'bg-white text-[#B28F76] border border-[#DDD0C2]'
              }`}>
                {msg.role === 'user' ? <User size={16} /> : <Bot size={16} />}
              </div>

              {/* Bubble */}
              <div className={`p-4 rounded-2xl text-sm md:text-base ${
                msg.role === 'user'
                  ? 'bg-[#B28F76] text-[#F3EAE5] rounded-tr-sm'
                  : 'bg-white border border-[#DDD0C2] text-[#B28F76] rounded-tl-sm'
              }`}>
                {msg.content}
              </div>

            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex w-full justify-start">
            <div className="flex gap-3 max-w-[85%] sm:max-w-[70%]">
              <div className="shrink-0 w-8 h-8 rounded-full flex items-center justify-center bg-white text-[#B28F76] border border-[#DDD0C2]">
                <Bot size={16} />
              </div>
              <div className="p-4 rounded-2xl rounded-tl-sm bg-white border border-[#DDD0C2] text-[#B28F76] flex items-center gap-2">
                <Loader2 size={16} className="animate-spin text-[#B28F76]/70" />
                <span className="text-sm">Pensando...</span>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-[#F3EAE5] border-t border-[#DDD0C2]">
        <form 
          onSubmit={handleSubmit}
          className="flex gap-2 items-center bg-white border border-[#DDD0C2] rounded-full p-1 pl-4 shadow-sm focus-within:ring-2 focus-within:ring-[#B28F76] focus-within:border-[#B28F76] transition-all"
        >
          <input
            type="text"
            className="flex-1 bg-transparent border-none focus:outline-none text-[#B28F76] placeholder:text-[#B28F76]/50 text-sm md:text-base py-2"
            placeholder="Pergunte algo sobre os pedidos ou faturamento..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="bg-[#B28F76] hover:bg-[#D2B6A2] disabled:bg-[#DDD0C2] disabled:cursor-not-allowed text-[#F3EAE5] p-2 sm:px-6 rounded-full flex items-center justify-center transition-colors"
          >
            <Send size={18} className="ml-1" />
          </button>
        </form>
      </div>

    </div>
  )
}
