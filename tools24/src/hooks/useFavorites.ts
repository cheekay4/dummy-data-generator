"use client";

import { useState, useEffect, useCallback } from "react";

const STORAGE_KEY = "tools24_favorites";

export function useFavorites(): {
  favorites: string[];
  toggle: (id: string) => void;
  isFavorite: (id: string) => boolean;
  clear: () => void;
} {
  const [favorites, setFavorites] = useState<string[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) setFavorites(JSON.parse(stored));
    } catch {
      // ignore
    }
  }, []);

  const persist = useCallback((next: string[]): void => {
    setFavorites(next);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      // ignore
    }
  }, []);

  const toggle = useCallback(
    (id: string): void => {
      persist(
        favorites.includes(id)
          ? favorites.filter((f) => f !== id)
          : [...favorites, id]
      );
    },
    [favorites, persist]
  );

  const isFavorite = useCallback(
    (id: string): boolean => favorites.includes(id),
    [favorites]
  );

  const clear = useCallback((): void => {
    persist([]);
  }, [persist]);

  return { favorites, toggle, isFavorite, clear };
}
