'use client'

import { create } from 'zustand'
import type {
  InterviewPhase,
  ChatMessage,
  ExtractedKnowledge,
  ExtractedKnowledgeItem,
  InterviewTemplate,
} from '@/lib/types'

interface InterviewState {
  interviewId: string | null
  currentPhase: InterviewPhase
  currentPhaseIndex: number
  messages: ChatMessage[]
  extractedKnowledge: ExtractedKnowledge
  selectedTemplate: InterviewTemplate | null
  manualTitle: string
  isGenerating: boolean
  generatedMarkdown: string | null
  isSending: boolean
  phaseJustAdvanced: boolean
  previousPhaseName: string | null

  setInterviewId: (id: string) => void
  addMessage: (msg: ChatMessage) => void
  setPhase: (phase: InterviewPhase, index: number, prevPhaseName: string) => void
  addKnowledge: (item: ExtractedKnowledgeItem) => void
  setTemplate: (t: InterviewTemplate) => void
  setManualTitle: (title: string) => void
  setGenerating: (v: boolean) => void
  setMarkdown: (md: string) => void
  setSending: (v: boolean) => void
  clearPhaseToast: () => void
  reset: () => void
}

const DEFAULT_STATE = {
  interviewId: null,
  currentPhase: 'overview' as InterviewPhase,
  currentPhaseIndex: 0,
  messages: [] as ChatMessage[],
  extractedKnowledge: { sections: [] } as ExtractedKnowledge,
  selectedTemplate: null,
  manualTitle: '',
  isGenerating: false,
  generatedMarkdown: null,
  isSending: false,
  phaseJustAdvanced: false,
  previousPhaseName: null,
}

export const useInterviewStore = create<InterviewState>((set) => ({
  ...DEFAULT_STATE,

  setInterviewId: (id) => set({ interviewId: id }),

  addMessage: (msg) =>
    set((state) => ({ messages: [...state.messages, msg] })),

  setPhase: (phase, index, prevPhaseName) =>
    set({ currentPhase: phase, currentPhaseIndex: index, phaseJustAdvanced: true, previousPhaseName: prevPhaseName }),

  addKnowledge: (item) =>
    set((state) => ({
      extractedKnowledge: {
        sections: [...state.extractedKnowledge.sections, item],
      },
    })),

  setTemplate: (t) => set({ selectedTemplate: t }),

  setManualTitle: (title) => set({ manualTitle: title }),

  setGenerating: (v) => set({ isGenerating: v }),

  setMarkdown: (md) => set({ generatedMarkdown: md }),

  setSending: (v) => set({ isSending: v }),

  clearPhaseToast: () => set({ phaseJustAdvanced: false, previousPhaseName: null }),

  reset: () => set({ ...DEFAULT_STATE }),
}))
