import { useEffect, useState, useMemo, memo, useCallback } from 'react';
import Box from '@mui/joy/Box';
import Typography from '@mui/joy/Typography';
import Checkbox from '@mui/joy/Checkbox';
import { useExcludedKanji } from '@/hooks/useExcludedKanji';
import { KanjiData } from '@/types/Result';

// チェックボックスコンポーネントをメモ化
const KanjiCheckbox = memo(({
  kanji,
  isExcluded,
  onToggle
}: {
  kanji: KanjiData;
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
    }}
  >
    <Checkbox
      label={kanji.character}
      checked={isExcluded}
      onChange={onToggle}
    />
  </Box>
), (prevProps, nextProps) =>
  prevProps.isExcluded === nextProps.isExcluded
);

type GroupedKanji = Record<number, KanjiData[]>

// グローバルな状態として保持
const useKanjiData = () => {
  const [groupedKanji, setGroupedKanji] = useState<GroupedKanji>({});
  const [maxStroke, setMaxStroke] = useState<number>(0);

  useEffect(() => {
    fetch('/kanji.json')
      .then(res => res.json())
      .then(data => {
        const groups = data.kanji.reduce((acc: GroupedKanji, kanji: KanjiData) => {
          (acc[kanji.stroke] = acc[kanji.stroke] || []).push(kanji);
          return acc;
        }, {});
        setGroupedKanji(groups);
        setMaxStroke(Math.max(...Object.keys(groups).map(Number)));
      });
  }, []);

  return { groupedKanji, maxStroke };
};

function Settings() {
  const { groupedKanji, maxStroke } = useKanjiData();
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
      {
        Array.from({ length: maxStroke }, (_, i) => i + 1).map(stroke => (
          groupedKanji[stroke] && (
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
                {groupedKanji[stroke].map((kanji) => (
                  <KanjiCheckbox
                    key={kanji.character}
                    kanji={kanji}
                    isExcluded={excludedKanjiSet.has(kanji.character)}
                    onToggle={() => handleToggle(kanji.character)}
                  />
                ))}
              </Box>
            </Box>
          )
        ))}
    </Box>
  );
}

export default memo(Settings);