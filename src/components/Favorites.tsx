import Box from '@mui/joy/Box';
import Typography from '@mui/joy/Typography';
import ResultCard from "./ResultCard";
import { useFavorites } from '@/hooks/useFavorites';

type FavoritesProps = {
};

function Favorites({ }: FavoritesProps) {
  const { favorites, addFavorite, removeFavorite } = useFavorites();

  return (Object.keys(favorites).length === 0) ? (
    <Typography>まだお気に入りに追加された名前はありません</Typography>
  ) : (
    <>
      {Object.keys(favorites).map((strokeGroup) => (
        <Box key={strokeGroup} mb={4}>
          <Typography fontSize="lg" fontWeight="bold" mb={2}>
            合計画数: {strokeGroup}
          </Typography>
          {favorites[parseInt(strokeGroup)].map((result, index) => (
            <ResultCard
              key={index}
              strokeGroup={parseInt(strokeGroup)}
              result={result}
              onAddFavorite={addFavorite}
              onRemoveFavorite={removeFavorite}
              isFavorite={true}
            />
          ))}
        </Box>
      ))}
    </>
  );
}

export default Favorites;
