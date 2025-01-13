import { useEffect, useState, useMemo, memo, useCallback } from 'react';
import Box from '@mui/joy/Box';
import Typography from '@mui/joy/Typography';
import Checkbox from '@mui/joy/Checkbox';
import { useExcludedKanji } from '@/hooks/useExcludedKanji';
import { useKanjiData } from '@/store/atoms';
import { KanjiCache } from '@/types/KanjiTypes';

const MAX_STROKE = 30;

// チェックボックスコンポーネントをメモ化
const KanjiCheckbox = memo(({
  kanji,
  isExcluded,
  onToggle
}: {
  kanji: string;
  isExcluded: boolean;
  onToggle: () => void;
}) => (
  <Box
    sx={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 1,
      border: '1px solid',
      borderColor: 'divider',
      borderRadius: 'sm',
      background: 'var(--joy-palette-background-surface)',
    }}
  >
    <Checkbox
      label={kanji}
      checked={isExcluded}
      onChange={onToggle}
      size='lg'
      sx={{

      }}
    />
  </Box>
), (prevProps, nextProps) =>
  prevProps.isExcluded === nextProps.isExcluded
);

function Settings() {
  const kanjiCache = useKanjiData();
  const { excludedKanji, toggleExcludedKanji } = useExcludedKanji();

  // 除外漢字のSetを作成（高速な検索のため）
  const excludedKanjiSet = useMemo(
    () => new Set(excludedKanji.map(k => k.character)),
    [excludedKanji]
  );
  const handleToggle = useCallback((character: string) => {
    toggleExcludedKanji(character);
  }, [toggleExcludedKanji]);

  return (
    <Box>
      <Typography level="h2" mb={2}>
        除外する漢字の設定
      </Typography>
      <Typography level="body-md" mb={4}>
        チェックを入れた漢字は名前の組み合わせに使用されません
      </Typography>
      {kanjiCache.isLoading ? (
        <Typography level="body-md" textAlign="center">
          漢字データを読み込み中...
        </Typography>
      ) : (
        kanjiCache && Array.from({ length: MAX_STROKE }, (_, i) => i + 1).map(stroke => (
          kanjiCache.strokeGroupedKanji[stroke] && (
            <Box key={stroke} mb={4}>
              <Typography level="title-lg" mb={2} sx={{
                borderBottom: '2px solid',
                borderColor: 'divider',
                pb: 1
              }}
              >
                {stroke}画
              </Typography>
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(80px, 1fr))',
                  gap: 2,
                }}
              >
                {kanjiCache.strokeGroupedKanji[stroke].map((kanji, index) => (
                  <KanjiCheckbox
                    key={`${stroke}-${index}`}
                    kanji={kanji}
                    isExcluded={excludedKanjiSet.has(kanji)}
                    onToggle={() => handleToggle(kanji)}
                  />
                ))}
              </Box>
            </Box>
          )
        ))
      )}
    </Box>
  );
}

export default memo(Settings);