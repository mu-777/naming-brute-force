import { atom, useAtom } from 'jotai';
import { Result, SearchParams, SearchMode, KanjiCache, KanjiInfo } from '@/types/KanjiTypes';
import { useEffect } from 'react';

export const resultsAtom = atom<Result[]>([]);

export const searchParamsAtom = atom<SearchParams>({
  kanjiInput: [],
  searchMode: SearchMode.CONTAIN,
  charCount: 2,
  strokeCount: 10
});

// ローカルストレージから初期値を読み込む
const savedFavorites = localStorage.getItem('favorites');
const initialFavorites = savedFavorites ? JSON.parse(savedFavorites) : {};

export const favoritesAtom = atom<Record<number, Result[]>>(initialFavorites);

export const useResults = () => {
  const [results, setResults] = useAtom(resultsAtom);

  const updateResults = (newResults: Result[]) => {
    setResults(prev => [...prev, ...newResults]);
  };

  const removeResult = (index: number) => {
    setResults(prev => prev.filter((_, i) => i !== index));
  };

  return { results, setResults, updateResults, removeResult };
};

type KanjiData = {
  character: string;
  stroke: number;
  linkpath: string;
};

export const kanjiCacheAtom = atom<KanjiCache>({
  kanjiDict: {},
  strokeGroupedKanji: {}
});

export const useKanjiData = () => {
  const [kanjiCache, setKanjiCache] = useAtom(kanjiCacheAtom);

  useEffect(() => {
    if (Object.keys(kanjiCache.kanjiDict).length > 0) return;

    fetch('/kanji.json')
      .then(res => res.json())
      .then(data => {
        const kanjiDict: Record<string, KanjiInfo> = {};
        const strokeGroupedKanji: Record<number, string[]> = {};
        
        data.kanji.forEach((kanji: KanjiData) => {
          kanjiDict[kanji.character] = {
            stroke: kanji.stroke,
            linkpath: kanji.linkpath
          };
          
          if (!strokeGroupedKanji[kanji.stroke]) {
            strokeGroupedKanji[kanji.stroke] = [];
          }
          strokeGroupedKanji[kanji.stroke].push(kanji.character);
        });

        setKanjiCache({
          kanjiDict,
          strokeGroupedKanji
        });
      });
  }, []);

  return kanjiCache;
};