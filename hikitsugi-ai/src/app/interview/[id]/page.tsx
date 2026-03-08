'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { ChevronLeft, Crown } from 'lucide-react'
import { useInterviewStore } from '@/stores/interviewStore'
import { useAuth } from '@/components/auth/AuthProvider'
import { PHASE_LABELS, PHASE_ORDER } from '@/lib/templates'
import ProgressBar from '@/components/interview/ProgressBar'
import ChatBubble from '@/components/interview/ChatBubble'
import KnowledgeSidebar from '@/components/interview/KnowledgeSidebar'
import InputArea from '@/components/interview/InputArea'
import GeneratingOverlay from '@/components/interview/GeneratingOverlay'
import type { ChatMessage, ExtractedKnowledgeItem } from '@/lib/types'

const FREE_TURN_LIMIT = 10

export default function InterviewPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const { profile } = useAuth()

  const {
    selectedTemplate,
    manualTitle,
    messages,
    extractedKnowledge,
    currentPhase,
    currentPhaseIndex,
    isSending,
    isGenerating,
    phaseJustAdvanced,
    previousPhaseName,
    addMessage,
    addKnowledge,
    setPhase,
    setSending,
    setGenerating,
    setMarkdown,
    clearPhaseToast,
  } = useInterviewStore()

  const [input, setInput] = useState('')
  const [error, setError] = useState<string | null>(null)
  const chatEndRef = useRef<HTMLDivElement>(null)
  const initializedRef = useRef(false)
  const saveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const plan = profile?.plan ?? 'free'
  const isPro = plan === 'pro' || plan === 'team'
  const userTurnCount = messages.filter(m => m.role === 'user').length
  const isAtTurnLimit = !isPro && userTurnCount >= FREE_TURN_LIMIT

  // Redirect if no template (e.g. page refresh lost state)
  useEffect(() => {
    if (!selectedTemplate) {
      router.replace('/interview/new')
    }
  }, [selectedTemplate, router])

  // Send initial AI greeting on mount (only once)
  useEffect(() => {
    if (!selectedTemplate || messages.length > 0 || initializedRef.current) return
    initializedRef.current = true

    const firstQuestion = selectedTemplate.questionFlow.overview[0]
    const greeting: ChatMessage = {
      id: crypto.randomUUID(),
      role: 'assistant',
      content: `${selectedTemplate.businessType}の引き継ぎですね。\n\n${firstQuestion}`,
      timestamp: new Date().toISOString(),
    }
    addMessage(greeting)
  }, [selectedTemplate, messages.length, addMessage])

  // Auto-scroll to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Clear phase toast after 3 seconds
  useEffect(() => {
    if (!phaseJustAdvanced) return
    const timer = setTimeout(() => clearPhaseToast(), 3000)
    return () => clearTimeout(timer)
  }, [phaseJustAdvanced, clearPhaseToast])

  // Debounced save to Supabase
  const saveConversation = useCallback(
    (msgs: ChatMessage[]) => {
      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current)
      saveTimeoutRef.current = setTimeout(() => {
        fetch(`/api/manuals/${id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ conversation: msgs }),
        }).catch(() => {})
      }, 2000)
    },
    [id]
  )

  const buildKnowledgeSummary = () => {
    const sections = extractedKnowledge.sections
    if (sections.length === 0) return ''
    return sections
      .slice(-10)
      .map(s => `・${s.title}: ${s.content}`)
      .join('\n')
  }

  const handleSend = async () => {
    if (!input.trim() || !selectedTemplate || isSending) return
    if (isAtTurnLimit) return

    const userText = input.trim()
    setInput('')
    setError(null)

    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: 'user',
      content: userText,
      timestamp: new Date().toISOString(),
      inputMethod: 'text',
    }
    addMessage(userMessage)
    setSending(true)

    try {
      const conversationForApi = [...messages, userMessage].map(m => ({
        role: m.role,
        content: m.content,
      }))

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: conversationForApi,
          templateKey: selectedTemplate.templateKey,
          templateDisplayName: selectedTemplate.displayName,
          questionFlow: selectedTemplate.questionFlow,
          currentPhase,
          currentPhaseIndex,
          extractedKnowledgeSummary: buildKnowledgeSummary(),
        }),
      })

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}))
        throw new Error(errData.message || 'AIとの通信に失敗しました。')
      }

      const data = await res.json()

      const knowledgeItems: ExtractedKnowledgeItem[] = (data.extractedKnowledge ?? []).map(
        (k: { title: string; content: string; phase: string }) => ({
          id: crypto.randomUUID(),
          title: k.title,
          content: k.content,
          confidence: 0.85,
          phase: k.phase || currentPhase,
        })
      )
      knowledgeItems.forEach(addKnowledge)

      if (data.shouldAdvancePhase && currentPhaseIndex < PHASE_ORDER.length - 1) {
        const nextIdx = currentPhaseIndex + 1
        setPhase(PHASE_ORDER[nextIdx], nextIdx, PHASE_LABELS[currentPhase])
      }

      const badgeItem = knowledgeItems[0] ?? undefined

      const aiMessage: ChatMessage = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: data.response,
        timestamp: new Date().toISOString(),
        extractedKnowledge: badgeItem,
      }
      addMessage(aiMessage)

      // Save to DB (debounced)
      saveConversation([...messages, userMessage, aiMessage])
    } catch (err) {
      const msg = err instanceof Error ? err.message : '通信エラーが発生しました。'
      setError(msg)
    } finally {
      setSending(false)
    }
  }

  const handleGenerateManual = async () => {
    if (!selectedTemplate) return
    if (messages.length < 3) {
      setError('もう少し対話を続けてからマニュアルを生成してください。')
      return
    }

    const confirmed = window.confirm(
      'これまでの内容でマニュアルを生成します。\n後から編集もできます。よろしいですか？'
    )
    if (!confirmed) return

    setGenerating(true)
    setError(null)

    // Update status to generating
    await fetch(`/api/manuals/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'generating' }),
    }).catch(() => {})

    try {
      const conversationForApi = messages.map(m => ({
        role: m.role,
        content: m.content,
      }))

      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          conversation: conversationForApi,
          templateDisplayName: selectedTemplate.displayName,
          outputSections: selectedTemplate.outputTemplate.sections,
          extractedKnowledgeSummary: buildKnowledgeSummary(),
          manualTitle,
        }),
      })

      if (!res.ok) throw new Error('マニュアル生成に失敗しました。')

      const reader = res.body?.getReader()
      if (!reader) throw new Error('Stream not available')

      const decoder = new TextDecoder()
      let markdown = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        markdown += decoder.decode(value, { stream: true })
      }

      setMarkdown(markdown)

      // Compute stats
      const sectionCount = (markdown.match(/^##\s/gm) ?? []).length
      const wordCount = markdown.replace(/[#*`>\-\[\]]/g, '').replace(/\s+/g, ' ').length
      const readMinutes = Math.ceil(wordCount / 400)

      // Save to DB
      await fetch(`/api/manuals/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: 'completed',
          content_markdown: markdown,
          section_count: sectionCount,
          word_count: wordCount,
          estimated_read_minutes: readMinutes,
        }),
      }).catch(() => {})

      router.push(`/manual/${id}`)
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'マニュアル生成に失敗しました。'
      setError(msg)

      await fetch(`/api/manuals/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'interviewing' }),
      }).catch(() => {})

      setGenerating(false)
    }
  }

  if (!selectedTemplate) return null

  return (
    <>
      {isGenerating && <GeneratingOverlay />}

      <div className="flex h-screen overflow-hidden bg-stone-50">
        {/* Main chat area */}
        <div className="flex flex-col flex-1 min-w-0">
          {/* Interview header */}
          <div className="bg-white/80 backdrop-blur-sm border-b border-neutral-100 px-4 py-2.5 flex-shrink-0">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2 min-w-0">
                <Link href="/dashboard" className="text-neutral-500 hover:text-neutral-700 flex-shrink-0 transition-colors">
                  <ChevronLeft size={18} />
                </Link>
                <div className="min-w-0">
                  <h1 className="font-medium text-neutral-800 text-sm truncate">
                    {manualTitle}
                  </h1>
                  <span className="text-[11px] text-neutral-400">
                    {selectedTemplate.businessType}ひな形
                  </span>
                </div>
              </div>
              {currentPhaseIndex >= 2 && (
                <button
                  onClick={handleGenerateManual}
                  disabled={isSending || isGenerating}
                  className="bg-neutral-900 hover:bg-neutral-700 text-white text-[11px] font-semibold px-3 py-1.5 rounded-lg flex-shrink-0 transition-colors disabled:opacity-50"
                >
                  マニュアル生成
                </button>
              )}
            </div>
            <ProgressBar currentPhaseIndex={currentPhaseIndex} />
          </div>

          {/* Chat messages */}
          <div className="flex-1 overflow-y-auto py-6">
            <div className="max-w-2xl mx-auto px-4 space-y-5">
              {messages.map((msg) => (
                <ChatBubble key={msg.id} message={msg} />
              ))}

              {/* Phase transition toast */}
              {phaseJustAdvanced && previousPhaseName && (
                <div className="flex justify-center py-1">
                  <div className="bg-emerald-50 text-emerald-700 text-[11px] font-medium px-3 py-1.5 rounded-full border border-emerald-200/50">
                    「{previousPhaseName}」のヒアリング完了
                  </div>
                </div>
              )}

              {isSending && (
                <div className="flex gap-3 items-start">
                  <div className="w-8 h-8 bg-slate-300 rounded-lg flex-shrink-0 animate-pulse" />
                  <div className="bg-white rounded-2xl rounded-tl-md px-5 py-3.5 shadow-sm border border-neutral-200/50">
                    <div className="flex gap-1">
                      <div className="w-1.5 h-1.5 bg-neutral-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <div className="w-1.5 h-1.5 bg-neutral-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <div className="w-1.5 h-1.5 bg-neutral-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                </div>
              )}

              {/* Turn limit warning */}
              {isAtTurnLimit && (
                <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 flex items-start gap-3">
                  <Crown size={16} className="text-amber-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-[13px] text-amber-800 font-medium">
                      無料プランの対話上限（{FREE_TURN_LIMIT}回）に達しました
                    </p>
                    <p className="text-[12px] text-amber-700 mt-0.5">
                      Proプランにアップグレードすると30回まで対話できます。
                      または今の内容でマニュアルを生成できます。
                    </p>
                    <div className="flex gap-2 mt-2">
                      <Link
                        href="/settings"
                        className="text-[12px] font-semibold text-white bg-amber-500 hover:bg-amber-600 px-3 py-1.5 rounded-lg transition-colors"
                      >
                        Proにアップグレード
                      </Link>
                      {currentPhaseIndex >= 1 && (
                        <button
                          onClick={handleGenerateManual}
                          className="text-[12px] font-semibold text-amber-700 bg-amber-100 hover:bg-amber-200 px-3 py-1.5 rounded-lg transition-colors"
                        >
                          今すぐ生成
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3">
                  <p className="text-[12px] text-red-600">{error}</p>
                </div>
              )}

              <div ref={chatEndRef} />
            </div>
          </div>

          {/* Mobile knowledge trigger */}
          <KnowledgeSidebar
            knowledge={extractedKnowledge}
            currentPhaseIndex={currentPhaseIndex}
            outputSections={selectedTemplate.outputTemplate.sections}
            mobileOnly
          />

          {/* Input area */}
          <div className="bg-white border-t border-neutral-200 flex-shrink-0">
            <div className="max-w-2xl mx-auto">
              <InputArea
                value={input}
                onChange={setInput}
                onSend={handleSend}
                disabled={isSending || isGenerating || isAtTurnLimit}
              />
            </div>
          </div>
        </div>

        {/* Desktop sidebar */}
        <KnowledgeSidebar
          knowledge={extractedKnowledge}
          currentPhaseIndex={currentPhaseIndex}
          outputSections={selectedTemplate.outputTemplate.sections}
          desktopOnly
        />
      </div>
    </>
  )
}
