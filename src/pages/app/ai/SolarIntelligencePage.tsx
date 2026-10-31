import { useState } from 'react'
import {
  Sparkles,
  Bot,
  Send,
  Lightbulb
} from 'lucide-react'

interface Message {
  id: string
  sender: 'ai' | 'user'
  text: string
  timestamp: string
}

const INITIAL_MESSAGES: Message[] = [
  {
    id: 'm-01',
    sender: 'ai',
    text: 'Hello! I am SunPower Solar Intelligence AI. I can calculate optimal system capacities, simulate shadow derating, troubleshoot inverter fault codes, and check warranty terms.',
    timestamp: '10:00 AM',
  },
]

export function SolarIntelligencePage() {
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES)
  const [inputText, setInputText] = useState('')
  const [isTyping, setIsTyping] = useState(false)

  const handleSend = (textToSend?: string) => {
    const text = textToSend || inputText
    if (!text.trim()) return

    const userMsg: Message = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text: text.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }

    setMessages(prev => [...prev, userMsg])
    if (!textToSend) setInputText('')
    setIsTyping(true)

    setTimeout(() => {
      let reply = 'According to our system configuration parameters and engineering guidelines, your query has been processed.'

      const query = text.toLowerCase()
      if (query.includes('err-f04') || query.includes('over-voltage') || query.includes('fault')) {
        reply = 'ERR-F04 indicates a DC Bus Over-Voltage Condition. Recommended procedure: 1) Verify string open-circuit voltage Voc does not exceed inverter maximum MPPT window (550V DC). 2) Check for high grid voltage back-feed during peak sunshine hours. 3) Inspect DC Surge Protection Device (SPD). In active warranty, this RMA diagnostics is covered at ₹0 customer cost.'
      } else if (query.includes('bill') || query.includes('size') || query.includes('capacity')) {
        reply = 'For an average monthly electricity bill of ₹4,000–₹5,000 (~400–450 units/month), a 3 kW or 4 kW On-Grid system is optimal. It requires ~280 sq.ft of shadow-free rooftop space and will generate ~12–16 units/day, saving approximately ₹3,800/month with PM Surya Ghar CFA subsidy eligibility of up to ₹78,000.'
      } else if (query.includes('warranty') || query.includes('terms')) {
        reply = 'SunPower One standard warranty policy: Tier-1 Solar PV modules carry 20 Years linear degradation performance warranty (> 80% output at Year 20). Inverters and Battery Energy Storage Systems carry 2 Years full replacement guarantee starting upon serial dispatch confirmation.'
      } else if (query.includes('shadow') || query.includes('tilt')) {
        reply = 'In South India (Bengaluru 12.97° N), optimal solar panel tilt is 13°–15° due South. Shadow free requirement: Ensure minimum 3 meters clearance from parapet walls on the southern edge to eliminate morning and evening cosine loss.'
      }

      const aiReply: Message = {
        id: `msg-${Date.now() + 1}`,
        sender: 'ai',
        text: reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      }

      setMessages(prev => [...prev, aiReply])
      setIsTyping(false)
    }, 800)
  }

  return (
    <div className="space-y-6 pb-12">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-[#172747] p-6 text-white shadow-xl">
        <div className="absolute -right-12 -top-12 h-48 w-48 rounded-full bg-[#E9DDCA]/10 blur-2xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-[#E9DDCA]">
              <Sparkles className="h-3.5 w-3.5 text-[#E9DDCA]" />
              Deep Solar Engineering AI
            </div>
            <h1 className="mt-2 text-2xl font-bold tracking-tight text-white font-['Plus_Jakarta_Sans']">
              Solar Intelligence Assistant
            </h1>
            <p className="text-sm text-[#F7F3EC]/80">
              Technical advisory: Automated PV sizing, shadow loss estimation, IEC fault diagnostics, and warranty policy lookup.
            </p>
          </div>
        </div>
      </div>

      {/* Suggested Prompt Chips */}
      <div className="flex flex-wrap gap-2">
        {[
          'Troubleshoot ERR-F04 Inverter Over-Voltage Fault',
          'Calculate system size for ₹4,500 monthly electricity bill',
          'What is the standard warranty coverage terms for panels & inverters?',
          'Optimal roof tilt & azimuth angle for Bengaluru region',
        ].map((prompt, i) => (
          <button
            key={i}
            onClick={() => handleSend(prompt)}
            className="rounded-xl border border-[#E8E0D6] bg-white px-3.5 py-2 text-xs font-semibold text-[#172747] hover:bg-[#F7F3EC] hover:border-[#172747] transition-all shadow-sm text-left flex items-center gap-1.5"
          >
            <Lightbulb className="h-3.5 w-3.5 text-[#493027] flex-shrink-0" />
            {prompt}
          </button>
        ))}
      </div>

      {/* Chat Window */}
      <div className="rounded-2xl bg-white shadow-sm border border-[#E8E0D6] flex flex-col h-[520px] overflow-hidden">
        {/* Messages Scroll Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex gap-3 max-w-2xl ${m.sender === 'user' ? 'ml-auto flex-row-reverse' : ''}`}
            >
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-xl flex-shrink-0 text-xs font-bold ${
                  m.sender === 'user'
                    ? 'bg-[#493027] text-white'
                    : 'bg-[#172747] text-[#E9DDCA]'
                }`}
              >
                {m.sender === 'user' ? 'U' : <Bot className="h-4 w-4" />}
              </div>

              <div
                className={`rounded-2xl p-4 text-xs leading-relaxed shadow-sm ${
                  m.sender === 'user'
                    ? 'bg-[#172747] text-white rounded-tr-none'
                    : 'bg-[#F7F3EC] text-[#172747] border border-[#E8E0D6] rounded-tl-none'
                }`}
              >
                <p>{m.text}</p>
                <span
                  className={`block text-[10px] mt-2 font-mono ${
                    m.sender === 'user' ? 'text-white/60 text-right' : 'text-[#6E7787]'
                  }`}
                >
                  {m.timestamp}
                </span>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex gap-3 max-w-sm">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#172747] text-[#E9DDCA]">
                <Bot className="h-4 w-4" />
              </div>
              <div className="rounded-2xl bg-[#F7F3EC] p-3 text-xs border border-[#E8E0D6] flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-[#172747] animate-bounce" />
                <span className="h-2 w-2 rounded-full bg-[#172747] animate-bounce [animation-delay:0.2s]" />
                <span className="h-2 w-2 rounded-full bg-[#172747] animate-bounce [animation-delay:0.4s]" />
              </div>
            </div>
          )}
        </div>

        {/* Input Footer */}
        <div className="p-4 border-t border-[#E8E0D6] bg-[#F7F3EC]/50 flex gap-2">
          <input
            type="text"
            placeholder="Ask about solar sizing, inverter error codes, warranty policies..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            className="flex-1 rounded-xl border border-[#E8E0D6] px-4 py-3 text-xs bg-white text-[#172747] focus:border-[#172747] focus:outline-none"
          />
          <button
            onClick={() => handleSend()}
            className="flex items-center justify-center gap-1.5 rounded-xl bg-[#172747] px-5 py-3 text-xs font-bold text-white hover:bg-[#011232] shadow transition-colors"
          >
            <Send className="h-4 w-4" />
            Send
          </button>
        </div>
      </div>
    </div>
  )
}
