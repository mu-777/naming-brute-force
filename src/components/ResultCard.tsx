import Typography from '@mui/joy/Typography';
import Button from '@mui/joy/Button';
import Stack from '@mui/joy/Stack';
import Card from '@mui/joy/Card';

import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { Result } from '@/types/Result';

type ResultCardProps = {
  strokeGroup: number;
  result: Result;
  onRemove: (strokeGroup: number, index: number) => void;
  onAddFavorite: (result: Result) => void;
  onRemoveFavorite: (name: string) => void;
  isFavorite: boolean;
};

function ResultCard({ strokeGroup, result, onRemove, onAddFavorite, onRemoveFavorite, isFavorite }: ResultCardProps) {
  return (
    <Card
      variant="outlined"
      sx={{
        p: 3,
        mb: 2,
        position: 'relative',
        transition: 'transform 0.2s',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
        }
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

          <Button
            variant="soft"
            color="danger"
            onClick={() => onRemove(strokeGroup, 0)}
            size="sm"
          >
            削除
          </Button>
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
              <Typography level="body-sm">画数: {/* 各文字の画数 */}</Typography>
            </Card>
          ))}
        </Stack>
      </Stack>
    </Card>
  );
}

export default ResultCard;
