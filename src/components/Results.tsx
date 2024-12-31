import Box from '@mui/joy/Box';
import Typography from '@mui/joy/Typography';
import ResultCard from "./ResultCard";
import { useFavorites } from '@/hooks/useFavorites';
import { Result } from '@/types/Result';

type GroupedResults = Record<number, Result[]>;

type ResultsProps = {
  results: GroupedResults;
  onRemove: (strokeGroup: number, index: number) => void;
};


function Results({ results, onRemove }: ResultsProps) {
  const { favorites, addFavorite, removeFavorite } = useFavorites();

  return (Object.keys(results).length === 0) ? (
    <Typography>条件を入力して検索してください。</Typography>
  ) : (
    <>
      {Object.keys(results).map((strokeGroup) => (
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

export default Results;
