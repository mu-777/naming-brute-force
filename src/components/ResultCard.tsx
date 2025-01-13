import { memo } from 'react';
import Typography from '@mui/joy/Typography';
import Button from '@mui/joy/Button';
import Stack from '@mui/joy/Stack';
import Card from '@mui/joy/Card';

import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { Result } from '@/types/KanjiTypes';
import { useKanjiData } from '@/store/atoms';

type ResultCardProps = {
  result: Result;
  onRemove?: (strokeGroup: number, index: number) => void;
  onAddFavorite: (result: Result) => void;
  onRemoveFavorite: (name: string) => void;
  isFavorite: boolean;
};

function ResultCardBase({
  result, onAddFavorite, onRemoveFavorite, isFavorite
}: ResultCardProps) {

  const kanjiCache = useKanjiData();

  return (
    <Card
      variant="outlined"
      sx={{
        p: 2,
        mb: 2,
        position: 'relative',
        transition: 'all 0.3s ease',
        borderRadius: '16px',
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        backdropFilter: 'blur(8px)',
        '&:hover': {
          transform: 'translateY(0px)',
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          boxShadow: 'var(--joy-shadowRing, 0 0 #000), 0 4px 20px -2px var(--joy-shadowChannel, rgba(0 0 0 / 0.2))'
        }
      }}
    >
      <Stack direction="row" spacing={2} alignItems="center" justifyContent="space-between">
        <Stack direction="row" spacing={1}
          sx={{
          }}>
          <Button
            variant="soft"
            color="secondary"
            startDecorator={isFavorite ? <FavoriteIcon /> : <FavoriteBorderIcon />}
            size="sm"
            onClick={() => isFavorite ? onRemoveFavorite(result.name) : onAddFavorite(result)}
          >
            {isFavorite ? "削除" : "追加"}
          </Button>
        </Stack>

        <Stack direction="column" alignItems="center" sx={{ flex: '0 1 auto' }}>
          <Typography
            level="h2"
            sx={{
              fontSize: '3rem',
              textAlign: 'center',
              m: 0
            }}
          >
            {result.name}
          </Typography>
          <Typography
            level="body-sm"
            sx={{
              color: 'text.tertiary',
              mt: 0.5
            }}
          >
            (総画数: {result.totalStrokes})
          </Typography>
        </Stack>

        <Stack
          direction="column"
          spacing={1}
          sx={{
            flex: '0',
            minWidth: '80px'
          }}
        >
          {[...result.name].map((char, i) => (
            <Card
              key={i}
              variant="soft"
              sx={{
                p: 1,
                textAlign: 'center',
              }}
            >
              <Stack direction="row" alignItems="center" justifyContent="space-between">
                <Typography level="body-sm">
                  {char}
                </Typography>
                <Typography level="body-xs" sx={{ color: 'text.secondary' }}>
                  {`(${kanjiCache.kanjiDict[char].stroke}画)`}
                </Typography>
              </Stack>
            </Card>
          ))}
        </Stack>
      </Stack>
    </Card>
  );
}

const ResultCard = memo(ResultCardBase, (prevProps, nextProps) => {
  return prevProps.result.name === nextProps.result.name &&
    prevProps.isFavorite === nextProps.isFavorite;
});

export default ResultCard;
