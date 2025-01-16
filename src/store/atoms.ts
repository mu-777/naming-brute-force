import { atom, useAtom } from 'jotai';
import { Result, StrokeGroupedResult, SearchParams, SearchMode, KanjiCache, } from '@/types/KanjiTypes';
import { useEffect } from 'react';

// null→検索されてない状態、[]→検索した結果がゼロ
export const resultsAtom = atom<Result[] | null>(null);

export const searchParamsAtom = atom<SearchParams>({
  kanjiInput: [],
  searchMode: SearchMode.CONTAIN,
  charCount: 2,
  strokeCounts: []
});

// ローカルストレージから初期値を読み込む
const savedFavorites = localStorage.getItem('favorites');
const initialFavorites = savedFavorites ? JSON.parse(savedFavorites) : {};

export const favoritesAtom = atom<StrokeGroupedResult>(initialFavorites as StrokeGroupedResult);

export const useResults = () => {
  const [results, setResults] = useAtom(resultsAtom);

  const updateResults = (newResults: Result[]) => {
    setResults(prev => prev ? [...prev, ...newResults] : newResults);
  };

  const removeResult = (index: number) => {
    setResults(prev => prev ? prev.filter((_, i) => i !== index) : prev);
  };

  return { results, setResults, updateResults, removeResult };
};

export const kanjiCacheAtom = atom<KanjiCache>({
  kanjiDict: {},
  strokeGroupedKanji: {},
  isLoading: false
});

// Workerのステータスを管理するアトム
const workerStatusAtom = atom<{
  isInitialized: boolean;
  worker: Worker | null;
}>({
  isInitialized: false,
  worker: null
});

export const useKanjiData = () => {
  const [kanjiCache, setKanjiCache] = useAtom(kanjiCacheAtom);
  const [workerStatus, setWorkerStatus] = useAtom(workerStatusAtom);

  useEffect(() => {
    const loadKanjiData = async () => {
      if (Object.keys(kanjiCache.kanjiDict).length > 0 || workerStatus.isInitialized) {
        return;
      }

      setKanjiCache(prev => ({ ...prev, isLoading: true }));

      const worker = new Worker(
        new URL('../functions/kanjiFileLoader.worker.ts', import.meta.url),
        { type: 'module' }
      );

      setWorkerStatus({
        isInitialized: true,
        worker
      });

      worker.onmessage = (event) => {
        if (event.data.error) {
          console.error('漢字データの読み込みエラー:', event.data.error);
          setKanjiCache(prev => ({ ...prev, isLoading: false }));
        } else {
          setKanjiCache({
            kanjiDict: event.data.kanjiDict,
            strokeGroupedKanji: event.data.strokeGroupedKanji,
            isLoading: false
          });
        }
      };

      worker.postMessage(null);

      return () => {
        if (worker) {
          worker.terminate();
          setWorkerStatus(prev => ({ ...prev, worker: null }));
        }
      };
    };

    loadKanjiData();
  }, [kanjiCache, workerStatus, setKanjiCache, setWorkerStatus]);

  return kanjiCache;
};