import Box from '@mui/joy/Box';
import Typography from '@mui/joy/Typography';
import ResultCard from "./ResultCard";
import { useFavorites } from '@/hooks/useFavorites';
import { Result } from '@/types/Result';

type GroupedResults = Record<number, Result[]>;

type FavoritesProps = {
};


function Favorites({ }: FavoritesProps) {
  const { favorites, addFavorite, removeFavorite } = useFavorites();

  return (favorites.length === 0) ? (
    <Typography>まだお気に入りに追加された名前はありません</Typography>
  ) : (
    <>
      {favorites.map((strokeGroup) => (
        <Box key={strokeGroup} mb={4}>
          <Typography fontSize="lg" fontWeight="bold" mb={2}>
            合計画数: {strokeGroup}
          </Typography>
          {results[parseInt(strokeGroup)].map((result, index) => (
            <ResultCard
              key={index}
              strokeGroup={parseInt(strokeGroup)}
              result={result}
              onRemove={() => onRemove(parseInt(strokeGroup), index)}
              onAddFavorite={addFavorite}
              onRemoveFavorite={removeFavorite}
              isFavorite={favorites.some(fav => fav.name === result.name)}
            />
          ))}
        </Box>
      ))}
    </>
  );
}

export default Favorites;
