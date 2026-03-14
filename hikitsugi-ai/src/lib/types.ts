export type InterviewPhase =
  | 'overview'
  | 'procedure'
  | 'decision_criteria'
  | 'exceptions'
  | 'tips'
  | 'confirmation'

export type InputMethod = 'text' | 'voice_chat' | 'voice_upload' | 'mixed'

export type ManualStatus = 'interviewing' | 'generating' | 'completed' | 'archived'

export type BusinessType = 'restaurant' | 'beauty_salon' | 'professional_office' | 'general'

export interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: string
  inputMethod?: InputMethod
  extractedKnowledge?: ExtractedKnowledgeItem
}

export interface Manual {
  id: string
  title: string
  businessType: BusinessType
  templateKey: string
  status: ManualStatus
  conversation: ChatMessage[]
  contentMarkdown: string | null
  createdAt: string
  updatedAt: string
}

export interface QuestionFlow {
  overview: string[]
  procedure: string[]
  decision_criteria: string[]
  exceptions: string[]
  tips: string[]
}

export interface OutputTemplate {
  sections: string[]
}

export interface InterviewTemplate {
  templateKey: BusinessType
  businessType: string
  displayName: string
  description: string
  icon: string
  questionFlow: QuestionFlow
  outputTemplate: OutputTemplate
}

export interface ExtractedKnowledgeItem {
  id: string
  title: string
  content: string
  confidence: number
  phase: InterviewPhase
}

export interface ExtractedKnowledge {
  sections: ExtractedKnowledgeItem[]
}

export type TranscribeResponse = { text: string } | { error: string }
