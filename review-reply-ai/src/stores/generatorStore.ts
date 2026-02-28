import { create } from 'zustand'
import type {
  Platform,
  BusinessType,
  Tone,
  GenerateReplyResult,
} from '@/lib/types'

type Step = 'form' | 'loading' | 'result'

interface GeneratorState {
  reviewText: string
  rating: number
  platform: Platform
  businessType: BusinessType
  tone: Tone
  shopName: string
  shopDescription: string
  profileId: string | null
  modifierId: string | null

  step: Step
  result: GenerateReplyResult | null
  error: string | null
  remainingToday: number

  setReviewText: (v: string) => void
  setRating: (v: number) => void
  setPlatform: (v: Platform) => void
  setBusinessType: (v: BusinessType) => void
  setTone: (v: Tone) => void
  setShopName: (v: string) => void
  setShopDescription: (v: string) => void
  setProfileId: (v: string | null) => void
  setModifierId: (v: string | null) => void
  setStep: (v: Step) => void
  setResult: (result: GenerateReplyResult, remaining: number) => void
  setError: (msg: string) => void
  resetForm: () => void
}

const DEFAULT_STATE = {
  reviewText: '',
  rating: 0,
  platform: 'Google マップ' as Platform,
  businessType: '飲食店（カフェ・レストラン・居酒屋）' as BusinessType,
  tone: '丁寧' as Tone,
  shopName: '',
  shopDescription: '',
  profileId: null,
  modifierId: null,
  step: 'form' as const,
  result: null,
  error: null,
  remainingToday: -1,
}

export const useGeneratorStore = create<GeneratorState>((set) => ({
  ...DEFAULT_STATE,

  setReviewText: (v) => set({ reviewText: v }),
  setRating: (v) => set({ rating: v }),
  setPlatform: (v) => set({ platform: v }),
  setBusinessType: (v) => set({ businessType: v }),
  setTone: (v) => set({ tone: v }),
  setShopName: (v) => set({ shopName: v }),
  setShopDescription: (v) => set({ shopDescription: v }),
  setProfileId: (v) => set({ profileId: v }),
  setModifierId: (v) => set({ modifierId: v }),
  setStep: (v) => set({ step: v }),
  setResult: (result, remaining) =>
    set({ result, remainingToday: remaining, step: 'result', error: null }),
  setError: (msg) => set({ error: msg, step: 'form' }),
  resetForm: () => set({ ...DEFAULT_STATE }),
}))
