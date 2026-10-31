import { useState, useRef, useEffect } from 'react'
import { Send, Bot, Loader2, Sparkles, Copy, Check, ChevronDown, ChevronUp, BarChart2, PieChart, Table } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { processNaturalLanguageQuery, SUGGESTED_QUERIES, getSuggestedQueries, type AIQueryResult } from '@/lib/ai/assistant'
import { useSolarStore } from '@/lib/store/solarStore'

interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  result?: AIQueryResult
  timestamp: Date
}

export function AiAssistantPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [showSuggestions, setShowSuggestions] = useState(true)
  const [activeTab, setActiveTab] = useState('chat')
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const userRole = 'director' // Default role for AI assistant context

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  // Welcome message
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([{
        id: 'welcome',
        role: 'assistant',
        content: `Welcome to SunPower AI Assistant! I can help you query business data using natural language.

**Try asking me things like:**
• "Show me monthly revenue for the last 12 months"
• "What installations are scheduled this week?"
• "Which products are below reorder point?"
• "Show me open service tickets by priority"
• "What is our project profitability ranking?"
• "Which warranties are expiring in 90 days?"

**Quick suggestions based on your role (${userRole}):**`,
        timestamp: new Date(),
        result: {
          success: true,
          data: [],
          explanation: 'Welcome to AI Assistant',
          chartType: 'table'
        }
      }])
    }
  }, [userRole])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const userMessage = input.trim()
    setInput('')
    setShowSuggestions(false)
    setIsLoading(true)

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: userMessage,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMsg])

    try {
      // Get organization context from store or use demo
      const context = {
        userRole: 'director', // In real app, get from auth
        organizationId: 'a0000000-0000-0000-0000-000000000001',
        availableTables: []
      }

      const { processNaturalLanguageQuery } = await import('@/lib/ai/assistant')
      const result = await processNaturalLanguageQuery(userMessage, context)

      const assistantMsg: ChatMessage = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: result.success 
          ? (result.data && result.data.length > 0 
              ? `Found ${result.data.length} results. ${result.explanation || ''}`
              : result.explanation || 'Query executed successfully.')
          : `Error: ${result.error || 'Unknown error'}`,
        result,
        timestamp: new Date()
      }

      setMessages(prev => [...prev, assistantMsg])
    } catch (err) {
      const assistantMsg: ChatMessage = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: `Error: ${err instanceof Error ? err.message : 'Failed to process query'}`,
        timestamp: new Date()
      }
      setMessages(prev => [...prev, assistantMsg])
    } finally {
      setIsLoading(false)
    }
  }

  const handleSuggestionClick = (query: string) => {
    setInput(query)
    handleSubmit({ preventDefault: () => {} } as React.FormEvent<HTMLFormElement>)
  }

  const copySQL = (sql: string) => {
    navigator.clipboard.writeText(sql)
  }

  const renderResult = (result?: AIQueryResult) => {
    if (!result || !result.success) return null
    if (!result.data || result.data.length === 0) {
      return (
        <div className="text-center py-8 text-muted-foreground">
          <p className="text-sm">No data returned for this query.</p>
          <p className="text-xs mt-1">Try adjusting your question or check if data exists.</p>
        </div>
      )
    }

    const data = result.data as Record<string, unknown>[]

    switch (result.chartType) {
      case 'table':
        return (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  {Object.keys(data[0]).map(key => (
                    <th key={key} className="text-left p-2 font-medium text-muted-foreground uppercase tracking-wider text-xs">
                      {key.replace(/_/g, ' ')}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.slice(0, 50).map((row, i) => (
                  <tr key={i} className="border-b border-border/50 hover:bg-muted/50">
                    {Object.values(row).map((val, j) => (
                      <td key={j} className="p-2">
                        {val === null || val === undefined ? (
                          <span className="text-muted-foreground">-</span>
                        ) : typeof val === 'number' ? (
                          <span className="font-mono tabular-nums">{val.toLocaleString()}</span>
                        ) : (
                          <span>{String(val)}</span>
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
            {data.length > 50 && (
              <p className="text-xs text-muted-foreground mt-2 text-center">
                Showing 50 of {data.length} rows
              </p>
            )}
          </div>
        )
      case 'bar':
        return (
          <div className="space-y-3">
            {data.slice(0, 20).map((row, i) => {
              const keys = Object.keys(row)
              const label = row[keys[0]] as string
              const valueKey = keys.find(k => typeof row[k] === 'number')
              const value = valueKey ? Number(row[valueKey]) : 0
              const maxVal = Math.max(...data.slice(0, 20).map(r => Number(r[valueKey || keys[1]]) || 0))
              return (
                <div key={i} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="truncate max-w-[150px]">{label}</span>
                    <span className="font-mono tabular-nums">{value.toLocaleString()}</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-primary rounded-full transition-all"
                      style={{ width: maxVal > 0 ? `${(value / maxVal) * 100}%` : '0%' }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        )
      case 'pie':
        return (
          <div className="space-y-2">
            {data.slice(0, 10).map((row, i) => {
              const keys = Object.keys(row)
              const label = row[keys[0]] as string
              const valueKey = keys.find(k => typeof row[k] === 'number')
              const value = valueKey ? Number(row[valueKey]) : 0
              const total = data.slice(0, 10).reduce((sum, r) => sum + (Number(r[valueKey || keys[1]]) || 0), 0)
              const pct = total > 0 ? ((value / total) * 100).toFixed(1) : '0'
              return (
                <div key={i} className="flex items-center gap-3 text-sm">
                  <div className="w-3 h-3 rounded-full bg-primary" />
                  <span className="truncate max-w-[120px]">{label}</span>
                  <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-primary rounded-full" style={{ width: `${pct}%` }} />
                  </div>
                  <span className="font-mono text-xs w-16 text-right">{pct}%</span>
                </div>
              )
            })}
          </div>
        )
      case 'metric':
        return (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {data.slice(0, 4).map((row, i) => {
              const keys = Object.keys(row)
              const key = keys[0]
              const value = Object.values(row)[0]
              return (
                <Card key={i} className="p-4">
                  <p className="text-xs text-muted-foreground">{key}</p>
                  <p className="text-2xl font-bold font-mono">{String(value)}</p>
                </Card>
              )
            })}
          </div>
        )
      default:
        return (
          <pre className="bg-muted p-4 rounded text-xs overflow-x-auto max-h-64">
            {JSON.stringify(data.slice(0, 10), null, 2)}
          </pre>
        )
    }
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b bg-card">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Bot className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground">AI Assistant</h1>
            <p className="text-sm text-muted-foreground">Natural language queries for solar business intelligence</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="gap-1">
            <Sparkles className="h-3 w-3" />
            Solar Intelligence
          </Badge>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Chat Area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Suggestions Bar */}
          {showSuggestions && messages.length <= 1 && (
            <div className="p-4 border-b bg-muted/30">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium text-foreground">Quick Questions</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {getSuggestedQueries('director').slice(0, 6).map((query, i) => (
                  <Button
                    key={i}
                    variant="outline"
                    size="sm"
                    className="h-8 text-xs"
                    onClick={() => handleSuggestionClick(query)}
                  >
                    {query}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Messages */}
          <ScrollArea className="flex-1 p-4 space-y-4">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] ${msg.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-card border'}`}>
                  <div className="p-4 space-y-3">
                    <div className="prose prose-sm max-w-none">
                      {msg.content.split('\n').map((line, i) => (
                        <p key={i} className={msg.role === 'user' ? 'text-sm' : 'text-sm text-foreground'}>
                          {line}
                        </p>
                      ))}
                    </div>
                    
                    {msg.result && renderResult(msg.result)}
                    
                    {msg.result?.sql && (
                      <div className="relative group">
                        <div className="bg-muted p-3 rounded text-xs font-mono overflow-x-auto max-h-32">
                          {msg.result.sql}
                        </div>
                        <button
                          onClick={() => copySQL(msg.result!.sql!)}
                          className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity p-1 text-muted-foreground hover:text-foreground"
                          title="Copy SQL"
                        >
                          <Copy className="h-3 w-3" />
                        </button>
                      </div>
                    )}

                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span>{msg.timestamp.toLocaleTimeString()}</span>
                      {msg.result?.chartType && (
                        <Badge variant="outline" className="gap-1">
                          {msg.result.chartType === 'table' && <Table className="h-3 w-3" />}
                          {msg.result.chartType === 'bar' && <BarChart2 className="h-3 w-3" />}
                          {msg.result.chartType === 'pie' && <PieChart className="h-3 w-3" />}
                          {msg.result.chartType}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </ScrollArea>

          {/* Loading Indicator */}
          {isLoading && (
            <div className="p-4 flex justify-start">
              <div className="flex items-center gap-2 bg-card border p-3 rounded-lg animate-pulse">
                <Loader2 className="h-4 w-4 text-primary animate-spin" />
                <span className="text-sm text-muted-foreground">Analyzing query...</span>
              </div>
            </div>
          )}

          {/* Input Area */}
          <div className="p-4 border-t bg-card">
            <form onSubmit={handleSubmit} className="flex gap-2">
              <div className="flex-1 relative">
                <Input
                  ref={inputRef}
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  placeholder="Ask me anything about your solar business..."
                  disabled={isLoading}
                  className="pr-10"
                />
                {input && (
                  <button
                    onClick={() => setInput('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    type="button"
                  >
                    ✕
                  </button>
                )}
              </div>
              <Button
                type="submit"
                disabled={!input.trim() || isLoading}
                className="h-10 px-4"
              >
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}