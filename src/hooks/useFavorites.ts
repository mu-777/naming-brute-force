import { useAtom } from 'jotai';
import { favoritesAtom } from '@/store/atoms';
import { Result } from '@/types/Result';
import { useCallback, useEffect } from 'react';

export function useFavorites() {
  const [favorites, setFavorites] = useAtom(favoritesAtom);

  // 初期化時にローカルストレージから読み込み
  useEffect(() => {
    const saved = localStorage.getItem('favorites');
    if (saved) {
      setFavorites(JSON.parse(saved));
    }
  }, []);

  const addFavorite = useCallback((result: Result) => {
    setFavorites(prev => {
      const totalStroke = result.totalStrokes;
      return {
        ...prev,
        [totalStroke]: [...(prev[totalStroke] || []), result]
      };
    });
  }, []);

  const removeFavorite = useCallback((name: string) => {
    setFavorites(prev => {
      const newFavorites = { ...prev };
      Object.keys(newFavorites).forEach((strokeCount) => {
        newFavorites[parseInt(strokeCount)] = newFavorites[parseInt(strokeCount)].filter(
          favorite => favorite.name !== name
        );
        if (newFavorites[parseInt(strokeCount)].length === 0) {
          delete newFavorites[parseInt(strokeCount)];
        }
      });
      return newFavorites;
    });
  }, []);

  const isFavorite = useCallback((name: string): boolean => {
    return Object.values(favorites).flat().some(favorite => favorite.name === name);
  }, [favorites]);

  // お気に入りが更新されたらローカルストレージに保存
  useEffect(() => {
    localStorage.setItem('favorites', JSON.stringify(favorites));
  }, [favorites]);

  return { favorites, addFavorite, removeFavorite, isFavorite };
}