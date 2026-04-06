import { create } from "zustand";

interface SearchState {
  query: string;
  setQuery: (query: string) => void;
  heroVisible: boolean;
  setHeroVisible: (visible: boolean) => void;
}

export const useSearchStore = create<SearchState>((set) => ({
  query: "",
  setQuery: (query: string): void => set({ query }),
  heroVisible: true,
  setHeroVisible: (heroVisible: boolean): void => set({ heroVisible }),
}));
