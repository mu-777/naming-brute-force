import { useState } from 'react';
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
import { SearchMode, CharCount, SearchParams } from '@/types/Result';

type SearchFormProps = {
  searchParams: SearchParams;
  setSearchParams: React.Dispatch<React.SetStateAction<SearchParams>>;
  onSearch: () => void;
};

function SearchForm({ searchParams, setSearchParams, onSearch }: SearchFormProps) {
  const [useStrokeCount, setUseStrokeCount] = useState(false);

  return (
    <Box>
      <Stack direction="column" spacing={2.5}>
        <Stack direction="row" spacing={1} sx={{ flex: 1, alignItems: 'center' }}>
          <Input
            size="md"
            placeholder="使う漢字(例: 優, 太郎)"
            value={searchParams.kanjiInput.join(' ')}
            onChange={(e) => setSearchParams(prev => ({
              ...prev,
              kanjiInput: e.target.value.split(' ').filter(Boolean)
            }))}
            sx={{
              fontSize: '1.2rem',
              '--Input-focusedThickness': '2px',
              flex: 1
            }}
          />
          <Select
            size="md"
            value={searchParams.searchMode}
            onChange={(_, value) => {
              if (value && Object.values(SearchMode).includes(value as SearchMode)) {
                setSearchParams(prev => ({ ...prev, searchMode: value as SearchMode }));
              }
            }}
            defaultValue={SearchMode.CONTAIN}
            sx={{ flex: 1 }}
          >
            <Option value={SearchMode.CONTAIN}>を含む</Option>
            <Option value={SearchMode.START_WITH}>から始まる</Option>
            <Option value={SearchMode.END_WITH}>で終わる</Option>
          </Select>
          {/* <RadioGroup
            orientation="vertical"
            value={searchParams.searchMode}
            onChange={(e) => {
              const value = e.target.value as SearchMode;
              if (Object.values(SearchMode).includes(value)) {
                setSearchParams(prev => ({ ...prev, searchMode: value }));
              }
            }}
            defaultValue="CONTAIN"
            sx={{ flex: 1 }}
          >
            <Radio value={SearchMode.CONTAIN} label="を含む" />
            <Radio value={SearchMode.START_WITH} label="から始まる" />
            <Radio value={SearchMode.END_WITH} label="で終わる" />
          </RadioGroup> */}

        </Stack>

        <Stack direction="row" spacing={4} sx={{ flex: 1, alignItems: 'center' }}>
          <Typography level="title-lg">文字数</Typography>
          <RadioGroup
            orientation="horizontal"
            value={searchParams.charCount}
            onChange={(e) => {
              const value = parseInt(e.target.value) as CharCount;
              if (Object.values(CharCount).includes(value)) {
                setSearchParams(prev => ({ ...prev, charCount: value }));
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
              label={useStrokeCount ? '' : '指定する'}
              checked={useStrokeCount}
              onChange={(e) => {
                setUseStrokeCount(e.target.checked);
              }}
            />
            {useStrokeCount && (
              <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
                <Input
                  type="text"
                  size="md"
                  placeholder="例: 1,3-5,8"
                  // value={searchParams.strokeCounts?.join(',') || ''}
                  onChange={(e) => {
                    const value = e.target.value;
                    const separators = [',', '、', '，', ' ', '　', '。', '．', '\\.'];
                    const regex = new RegExp(separators.map(s => s.replace(/([.*+?^=!:${}()|[\]/\\])/g, '\\$1')).join('|'));
                    const parts = value.split(regex) // 区切り文字で分割
                      .map(p => p.trim()) // 前後の空白を削除
                      .filter(p => p.length > 0); // 空文字列を除外

                    const strokeCounts = parts.flatMap(part => {
                      const rangeDelimiters = ['-', '~', '〜', '－'];
                      const range = part.split(new RegExp(rangeDelimiters.map(s => s.replace(/([.*+?^=!:${}()|[\]/\\])/g, '\\$1')).join('|')));

                      if (range.length === 2) { // 範囲指定の処理
                        const num1 = parseInt(range[0].trim(), 10);
                        const num2 = parseInt(range[1].trim(), 10);
                        const start = Math.min(num1, num2);
                        const end = Math.max(num1, num2);
                        if (!isNaN(start) && !isNaN(end) && start <= end) {
                          return Array.from({ length: end - start + 1 }, (_, i) => start + i);
                        }
                      } else if (range.length === 1) {
                        const num = parseInt(range[0], 10);
                        return !isNaN(num) && num > 0 ? [num] : [];
                      }
                      return [];
                    });
                    // 重複を削除して昇順にソート
                    setSearchParams(prev => ({
                      ...prev,
                      strokeCounts: strokeCounts.length > 0 ? [...new Set(strokeCounts)].sort((a, b) => a - b) : null,
                    }));
                    // console.log('Final strokeCounts:', [...new Set(strokeCounts)].sort((a, b) => a - b));
                  }}
                />
              </Stack>
            )}
          </Stack>
        </Stack>

        <Button
          variant="solid"
          color="primary"
          onClick={onSearch}
          sx={{
            width: 'auto',
            mx: 'auto',
          }}
        >
          検索
        </Button>
      </Stack>
    </Box>
  );
}

export default SearchForm;
