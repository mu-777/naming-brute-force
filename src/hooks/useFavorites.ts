import { useState, useEffect } from 'react';
import { Result, GroupedResults } from '@/types/Result';

export function useFavorites() {
  const [favorites, setFavorites] = useState<GroupedResults>(() => {
    const saved = localStorage.getItem('favorites');
    return saved ? JSON.parse(saved) : {};
  });

  const addFavorite = (result: Result) => {
    setFavorites(prev => {
      const totalStroke = result.totalStrokes;
      return {
        ...prev,
        [totalStroke]: [...(prev[totalStroke] || []), result]
      };
    });
  };

  const removeFavorite = (name: string) => {
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
  };

  useEffect(() => {
    localStorage.setItem('favorites', JSON.stringify(favorites));
  }, [favorites]);

  return { favorites, addFavorite, removeFavorite };
}