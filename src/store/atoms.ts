import { atom, useAtom } from 'jotai';
import { Result, SearchParams, SearchMode } from '@/types/Result';

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