import Button from '@mui/joy/Button';
import Stack from '@mui/joy/Stack';
import Input from '@mui/joy/Input';
import Radio from '@mui/joy/Radio';
import RadioGroup from '@mui/joy/RadioGroup';
import Box from '@mui/joy/Box';
import { SearchMode, CharCount, SearchParams } from '@/types/Result';

type SearchFormProps = {
  searchParams: SearchParams;
  setSearchParams: React.Dispatch<React.SetStateAction<SearchParams>>;
  onSearch: () => void;
};

function SearchForm({ searchParams, setSearchParams, onSearch }: SearchFormProps) {
  return (
    <Box>
      <Stack spacing={2}>
        <Stack direction="row" spacing={2} alignItems="center">
          <Input
            placeholder="使いたい漢字を入力 (例: 優 翔)"
            value={searchParams.kanjiInput.join(' ')}
            onChange={(e) => setSearchParams(prev => ({
              ...prev,
              kanjiInput: e.target.value.split(' ').filter(Boolean)
            }))}
            sx={{
              flex: 2,
              fontSize: '1.2rem',
              '--Input-focusedThickness': '2px'
            }}
          />

          <RadioGroup
            orientation="horizontal"
            value={searchParams.searchMode}
            onChange={(e) => {
              const value = e.target.value as SearchMode;
              if (Object.values(SearchMode).includes(value)) {
                setSearchParams(prev => ({ ...prev, searchMode: value }));
              }
            }}
            defaultValue="CONTAIN"
            sx={{ flex: 2 }}
          >
            <Radio value={SearchMode.CONTAIN} label="を含む" />
            <Radio value={SearchMode.START_WITH} label="から始まる" />
            <Radio value={SearchMode.END_WITH} label="で終わる" />
          </RadioGroup>

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
            sx={{ flex: 1 }}
          >
            <Radio value={CharCount.TWO} label="2文字" />
            <Radio value={CharCount.THREE} label="3文字" />
          </RadioGroup>

          <Input
            type="number"
            placeholder="総画数"
            value={searchParams.strokeCount}
            onChange={(e) => {
              const value = parseInt(e.target.value);
              if (!isNaN(value) && value > 0) {
                setSearchParams(prev => ({ ...prev, strokeCount: value }));
              }
            }}
            sx={{ flex: 1 }}
          />
        </Stack>

        <Button
          variant="solid"
          color="primary"
          onClick={onSearch}
          sx={{
            width: '200px',
            mx: 'auto'
          }}
        >
          検索開始
        </Button>
      </Stack>
    </Box>
  );
}

export default SearchForm;
