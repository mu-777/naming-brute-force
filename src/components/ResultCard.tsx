import { memo } from 'react';
import Typography from '@mui/joy/Typography';
import Button from '@mui/joy/Button';
import Stack from '@mui/joy/Stack';
import Card from '@mui/joy/Card';

import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { Result } from '@/types/Result';

type ResultCardProps = {
  result: Result;
  onRemove?: (strokeGroup: number, index: number) => void;
  onAddFavorite: (result: Result) => void;
  onRemoveFavorite: (name: string) => void;
  isFavorite: boolean;
};

function ResultCardBase({
  result, onRemove, onAddFavorite, onRemoveFavorite, isFavorite
}: ResultCardProps) {

  return (
    <Card
      variant="outlined"
      sx={{
        p: 3,
        mb: 2,
        position: 'relative',
        transition: 'all 0.3s ease',
        borderRadius: '16px',
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        backdropFilter: 'blur(8px)',
        // '&:hover': {
        //   transform: 'translateY(-4px)',
        //   backgroundColor: 'rgba(255, 255, 255, 0.95)',
        //   boxShadow: 'var(--joy-shadowRing, 0 0 #000), 0 4px 20px -2px var(--joy-shadowChannel, rgba(0 0 0 / 0.2))'
        // }
      }}
    >
      <Stack spacing={2}>
        <Typography
          level="h2"
          sx={{
            fontSize: '3rem',
            textAlign: 'center',
            mb: 2
          }}
        >
          {result.name}
        </Typography>

        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Button
            variant="soft"
            color="neutral"
            startDecorator={isFavorite ? <FavoriteIcon /> : <FavoriteBorderIcon />}
            size="sm"
            onClick={() => isFavorite ? onRemoveFavorite(result.name) : onAddFavorite(result)}
          >
            {isFavorite ? "お気に入りから削除" : "お気に入りに追加"}
          </Button>
          {
            !onRemove ? null : <Button
              variant="soft"
              color="danger"
              onClick={() => console.log('remove')}
              size="sm"
            >
              削除
            </Button>
          }
        </Stack>

        <Stack
          direction="row"
          spacing={2}
          mt={1}
          justifyContent="center"
        >
          {[...result.name].map((char, i) => (
            <Card
              key={i}
              variant="soft"
              sx={{
                p: 2,
                textAlign: 'center',
                minWidth: '80px'
              }}
            >
              <Typography level="h4">{char}</Typography>
              <Typography level="body-sm">画数: xxx</Typography>
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
