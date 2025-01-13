import { useState, useMemo, Fragment } from 'react';
import Button from '@mui/joy/Button';
import Stack from '@mui/joy/Stack';
import Input from '@mui/joy/Input';
import Radio from '@mui/joy/Radio';
import RadioGroup from '@mui/joy/RadioGroup';
import Select from '@mui/joy/Select';
import Option from '@mui/joy/Option';
import Typography from '@mui/joy/Typography';
import Box from '@mui/joy/Box';
import Checkbox from '@mui/joy/Checkbox';
import CircularProgress from '@mui/joy/CircularProgress';
import { SearchMode, CharCount, SearchParams, KanjiCache } from '@/types/KanjiTypes';
import FormControl from '@mui/joy/FormControl';
import FormHelperText from '@mui/joy/FormHelperText';
import InfoOutlined from '@mui/icons-material/InfoOutlined';

type SearchFormProps = {
  kanjiCache: KanjiCache
  searchParams: SearchParams;
  setSearchParams: React.Dispatch<React.SetStateAction<SearchParams>>;
  onSearch: () => void;
  isKanjiLoading: boolean;
};

const SEPARATORS = [',', '、', '，', ' ', '　', '。', '．', '\\.'];
const SEPARATOR_REGEX = new RegExp(SEPARATORS.map(s => s.replace(/([.*+?^=!:${}()|[\]/\\])/g, '\\$1')).join('|'));

function SearchForm({ kanjiCache, searchParams, setSearchParams, onSearch, isKanjiLoading }: SearchFormProps) {
  const [useStrokeCount, setUseStrokeCount] = useState(false);
  const [inputedKanji, setInputedKanji] = useState("");
  const [kanjiInputError, setKanjiInputError] = useState<string | null>(null);
  const [strokeInputError, setStrokeInputError] = useState<string | null>(null);

  const kanjiCandidates: string[] = useMemo(() => {
    return Object.keys(kanjiCache.kanjiDict)
  }, [kanjiCache])

  const updateKanjiInputAndCharCount = (newInput: string, charCount: CharCount) => {
    console.log("updateKanjiInput", newInput)
    setKanjiInputError(null)
    if (newInput.length > 0 && newInput.split('').every((s) => !kanjiCandidates.includes(s))) {
      setKanjiInputError(`人名漢字に含まれない文字があります: ${newInput.split('').filter((s) => !kanjiCandidates.includes(s)).join(', ')}`)
      setSearchParams(prev => ({ ...prev, charCount: charCount, }))
      return;
    }
    if (SEPARATOR_REGEX.test(newInput)) {
      setKanjiInputError("複数の文字は指定できません")
      setSearchParams(prev => ({ ...prev, charCount: charCount, }))
      return;
    }
    if (newInput.length > 1 && charCount === CharCount.TWO) {
      setKanjiInputError("文字数2のときは1文字だけ入力してください")
      setSearchParams(prev => ({ ...prev, charCount: charCount, }))
      return;
    }
    if (newInput.length > 2 && charCount === CharCount.THREE) {
      setKanjiInputError("文字数3のときは1文字か2文字を入力してください")
      setSearchParams(prev => ({ ...prev, charCount: charCount, }))
      return;
    }
    setSearchParams(prev => ({
      ...prev,
      charCount: charCount,
      kanjiInput: newInput.split("")
    }))
  }

  return (
    <Box>
      <Stack direction="column" spacing={2.5} sx={{ padding: '16px' }}>
        <FormControl error={!!kanjiInputError}>
          <Input
            size="md"
            placeholder="使う漢字(例: 優, 太郎)"
            value={inputedKanji}
            onChange={(e) => {
              const str = e.target.value.trim();
              setInputedKanji(str);
              updateKanjiInputAndCharCount(str, searchParams.charCount);
            }}
            sx={{
              fontSize: '1.2rem',
              '--Input-focusedThickness': '2px',
              flex: 1
            }}
            endDecorator={
              <Fragment>
                <Select
                  size="md"
                  value={searchParams.searchMode}
                  onChange={(_, value) => {
                    if (value && Object.values(SearchMode).includes(value as SearchMode)) {
                      setSearchParams(prev => ({ ...prev, searchMode: value as SearchMode }));
                    }
                  }}
                  defaultValue={SearchMode.CONTAIN}
                  sx={{
                    mr: -1.5,
                    '&:hover': { bgcolor: 'transparent' },
                    width: '300px',
                    '@media (max-width: 768px)': {
                      width: '130px',
                    },
                  }}
                  slotProps={{
                    listbox: {
                      variant: 'outlined',
                    },
                  }}
                >
                  <Option value={SearchMode.CONTAIN}>を含む</Option>
                  <Option value={SearchMode.START_WITH}>から始まる</Option>
                  <Option value={SearchMode.END_WITH}>で終わる</Option>
                </Select>
              </Fragment>
            }
          />
          {kanjiInputError && (
            <FormHelperText> <InfoOutlined /> {kanjiInputError}</FormHelperText>
          )}
        </FormControl>

        <Stack direction="row" spacing={4} sx={{ flex: 1, alignItems: 'center' }}>
          <Typography level="title-lg">文字数</Typography>
          <RadioGroup
            orientation="horizontal"
            value={searchParams.charCount}
            onChange={(e) => {
              const value = parseInt(e.target.value) as CharCount;
              if (Object.values(CharCount).includes(value)) {
                updateKanjiInputAndCharCount(inputedKanji, value);
              }
            }}
            defaultValue="2"
            size="md"
          >
            <Radio value={CharCount.TWO} label="2文字" />
            <Radio value={CharCount.THREE} label="3文字" />
          </RadioGroup>
        </Stack>

        <Stack direction="row" spacing={4} sx={{ flex: 1, alignItems: 'center' }}>
          <Typography level="title-lg">総画数</Typography>
          <Stack direction="row" spacing={2} alignItems="center">
            <Checkbox
              size="md"
              sx={{ flex: 1 }}
              label={useStrokeCount ? '' : '指定する'}
              checked={useStrokeCount}
              onChange={(e) => {
                setUseStrokeCount(e.target.checked);
                if (!e.target.checked) {
                  setSearchParams(prev => ({ ...prev, strokeCounts: [] }));
                }
              }}
            />
            {useStrokeCount && (
              <Stack direction="row" spacing={1} sx={{ flex: 1, alignItems: 'center' }}>
                <FormControl error={!!strokeInputError} sx={{ width: '100%' }}>
                  <Input
                    type="text"
                    size="sm"
                    placeholder="例: 1,3-5,8"
                    sx={{ width: '100%' }}
                    // value={searchParams.strokeCounts?.join(',') || ''}
                    onChange={(e) => {
                      setStrokeInputError(null)
                      const value = e.target.value;
                      const parts = value.split(SEPARATOR_REGEX) // 区切り文字で分割
                        .map(p => p.trim()) // 前後の空白を削除
                        .filter(p => p.length > 0); // 空文字列を除外

                      const strokeCounts = parts.flatMap(part => {
                        const rangeDelimiters = ['-', '~', '〜', '－'];
                        const range = part.split(new RegExp(rangeDelimiters.map(s => s.replace(/([.*+?^=!:${}()|[\]/\\])/g, '\\$1')).join('|')));

                        if (range.length === 2) { // 範囲指定の処理
                          const num1 = parseInt(range[0].trim(), 10);
                          const num2 = parseInt(range[1].trim(), 10);
                          if (isNaN(num1) || isNaN(num2)) {
                            setStrokeInputError("数字以外の文字が入っています")
                            return [];
                          }
                          if ((num1 <= 0) || (num2 <= 0)) {
                            setStrokeInputError("0より大きい数字を入れてください")
                            return [];
                          }
                          const start = Math.min(num1, num2);
                          const end = Math.max(num1, num2);
                          return Array.from({ length: end - start + 1 }, (_, i) => start + i);
                        } else if (range.length === 1) {
                          const num = parseInt(range[0], 10);
                          if (isNaN(num)) {
                            setStrokeInputError("数字以外の文字が入っています")
                            return [];
                          }
                          if (num <= 0) {
                            setStrokeInputError("0より大きい数字を入れてください")
                            return [];
                          }
                          return !isNaN(num) && num > 0 ? [num] : [];
                        }
                        return [];
                      });
                      // 重複を削除して昇順にソート
                      setSearchParams(prev => ({
                        ...prev,
                        strokeCounts: strokeCounts.length > 0 ? [...new Set(strokeCounts)].sort((a, b) => a - b) : [],
                      }));
                      console.log('Final strokeCounts:', [...new Set(strokeCounts)].sort((a, b) => a - b));
                    }}
                  />
                  {strokeInputError && (
                    <FormHelperText>
                      <InfoOutlined /> {strokeInputError}
                    </FormHelperText>
                  )}
                </FormControl>

              </Stack>
            )}
          </Stack>
        </Stack>
        <Button
          variant="solid"
          color="primary"
          onClick={() => {
            if (searchParams.kanjiInput.length === 0) {
              setKanjiInputError("少なくとも1つの漢字を入力してください")
              return;
            }
            onSearch()
          }}
          sx={{
            width: 'auto',
            mx: 'auto',
            background: 'var(--joy-palette-gradient-main)',
            '&:hover': {
              // background: 'var(--joy-palette-gradient-heavy)',
            }
          }}
          disabled={isKanjiLoading || !!strokeInputError || !!kanjiInputError}
          startDecorator={isKanjiLoading && <CircularProgress size="sm" variant="soft" />}
        >
          {isKanjiLoading ? 'データ読み込み中...' : '検索'}
        </Button>
      </Stack>
    </Box>
  );
}

export default SearchForm;
