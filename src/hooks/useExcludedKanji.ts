import { useState, useCallback } from 'react';
import { ExcludedKanji } from '@/types/KanjiTypes';

export function useExcludedKanji() {
  const defaultExcludedKanji: ExcludedKanji[] = [
    { "character": "鬱" },
    { "character": "亡" },
    { "character": "凶" },
    { "character": "弔" },
    { "character": "犯" },
    { "character": "死" },
    { "character": "汚" },
    { "character": "災" },
    { "character": "忌" },
    { "character": "怨" },
    { "character": "醜" }
  ];
  const [excludedKanji, setExcludedKanji] = useState<ExcludedKanji[]>(() => {
    const saved = localStorage.getItem('excludedKanji');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (error) {
        console.error('除外漢字の読み込みに失敗しました:', error);
        return defaultExcludedKanji;
      }
    }
    return defaultExcludedKanji;
  });

  const toggleExcludedKanji = useCallback((character: string) => {
    setExcludedKanji(prev => {
      const isExcluded = prev.some(k => k.character === character);
      const newValue = isExcluded
        ? prev.filter(k => k.character !== character)
        : [...prev, { character }];

      localStorage.setItem('excludedKanji', JSON.stringify(newValue));
      return newValue;
    });
  }, []);
  return {
    excludedKanji,
    toggleExcludedKanji
  };
} 