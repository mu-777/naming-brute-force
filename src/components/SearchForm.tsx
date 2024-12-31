import { useState } from 'react';
import Box from '@mui/joy/Box';
import Typography from '@mui/joy/Typography';
import Button from '@mui/joy/Button';
import Stack from '@mui/joy/Stack';
import Input from '@mui/joy/Input';
import Radio from '@mui/joy/Radio';
import RadioGroup from '@mui/joy/RadioGroup';
import Card from '@mui/joy/Card';
import Checkbox from '@mui/joy/Checkbox';
import Select from '@mui/joy/Select';
import Option from '@mui/joy/Option';

type SearchFormProps = {
  kanjiInput: string;
  setKanjiInput: (value: string) => void;
  searchMode: string;
  setSearchMode: (value: string) => void;
  charCount: string;
  setCharCount: (value: string) => void;
  strokeCount: string;
  setStrokeCount: (value: string) => void;
  onSearch: () => void;
};

function SearchForm({
  kanjiInput,
  setKanjiInput,
  searchMode,
  setSearchMode,
  charCount,
  setCharCount,
  strokeCount,
  setStrokeCount,
  onSearch,
}: SearchFormProps) {
  return (
    <Box>
      <Stack spacing={2}>
        <Stack direction="row" spacing={2} alignItems="center">
          <Input
            placeholder="使いたい漢字を入力 (例: 優 翔)"
            value={kanjiInput}
            onChange={(e) => setKanjiInput(e.target.value)}
            sx={{ 
              flex: 2,
              fontSize: '1.2rem',
              '--Input-focusedThickness': '2px'
            }}
          />

          <RadioGroup
            orientation="horizontal"
            value={searchMode}
            onChange={(e) => setSearchMode(e.target.value)}
            defaultValue="CONTAIN"
            sx={{ flex: 2 }}
          >
            <Radio value="START" label="から始まる" />
            <Radio value="END" label="で終わる" />
            <Radio value="CONTAIN" label="を含む" />
          </RadioGroup>

          <RadioGroup
            orientation="horizontal"
            value={charCount}
            onChange={(e) => setCharCount(e.target.value)}
            defaultValue="2"
            sx={{ flex: 1 }}
          >
            <Radio value="2" label="2文字" />
            <Radio value="3" label="3文字" />
          </RadioGroup>

          <Input
            type="number"
            placeholder="総画数"
            value={strokeCount}
            onChange={(e) => {
              const value = parseInt(e.target.value);
              if (!isNaN(value) && value > 0) {
                setStrokeCount(e.target.value);
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
