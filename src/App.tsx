import { useState } from 'react';
import Box from '@mui/joy/Box';
import Header from './components/Header';
import SearchForm from './components/SearchForm';
import Results from './components/Results';
import Stack from '@mui/joy/Stack';
import Tabs from '@mui/joy/Tabs';
import TabList from '@mui/joy/TabList';
import Tab from '@mui/joy/Tab';
import Typography from '@mui/joy/Typography';
import ListItemDecorator from '@mui/joy/ListItemDecorator';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import SearchIcon from '@mui/icons-material/Search';
import ResultCard from './components/ResultCard';
import { Result, GroupedResults } from '@/types/Result';
import { useFavorites } from '@/hooks/useFavorites';



function App() {
  const [kanjiInput, setKanjiInput] = useState("");
  const [searchMode, setSearchMode] = useState("OR");
  const [charCount, setCharCount] = useState("");
  const [strokeCount, setStrokeCount] = useState("");
  const [results, setResults] = useState<GroupedResults>({});
  const [activeTab, setActiveTab] = useState("search");

  const handleSearch = () => {
    const dummyResults: Result[] = [
      { name: "優翔", totalStrokes: 20 },
      { name: "翔太", totalStrokes: 15 },
      { name: "翔太", totalStrokes: 15 },
      { name: "翔太", totalStrokes: 16 },
      { name: "翔太", totalStrokes: 16 },
      { name: "翔太", totalStrokes: 15 },
      { name: "翔太", totalStrokes: 15 },
      { name: "翔太", totalStrokes: 15 },
      { name: "優花", totalStrokes: 18 },
    ];
    const groupedResults = dummyResults.reduce<GroupedResults>((acc, result) => {
      if (!acc[result.totalStrokes]) {
        acc[result.totalStrokes] = [];
      }
      acc[result.totalStrokes].push(result);
      return acc;
    }, {});
    setResults(groupedResults);
  };

  const handleRemove = (strokeGroup: number, index: number) => {
    setResults((prevResults) => {
      const updatedResults = { ...prevResults };
      updatedResults[strokeGroup] = updatedResults[strokeGroup].filter((_, i) => i !== index);
      if (updatedResults[strokeGroup].length === 0) {
        delete updatedResults[strokeGroup];
      }
      return updatedResults;
    });
  };

  return (
    <Box
      sx={{
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden'
      }}
    >
      <Box
        sx={{
          flexShrink: 0
        }}
      >
        <Header />
        <SearchForm
          kanjiInput={kanjiInput}
          setKanjiInput={setKanjiInput}
          searchMode={searchMode}
          setSearchMode={setSearchMode}
          charCount={charCount}
          setCharCount={setCharCount}
          strokeCount={strokeCount}
          setStrokeCount={setStrokeCount}
          onSearch={handleSearch}
        />
      </Box>

      <Box
        sx={{
          flex: 1,
          overflow: 'auto',
          px: 4,
          pb: 4
        }}
      >
        <Tabs
          value={activeTab}
          onChange={(_, value) => setActiveTab(typeof value === 'string' ? value : 'search')}
          sx={{
            mb: 2,
            position: 'sticky',
            top: 0,
            backgroundColor: 'white',
            zIndex: 1
          }}
        >
          <TabList>
            <Tab value="search">
              <ListItemDecorator>
                <SearchIcon />
              </ListItemDecorator>
              検索結果
            </Tab>
            <Tab value="favorites">
              <ListItemDecorator>
                <FavoriteBorderIcon />
              </ListItemDecorator>
              お気に入り
            </Tab>
          </TabList>
        </Tabs>

        {activeTab === 'search' ? (
          <Results
            results={results}
            onRemove={handleRemove}
          />
        ) : (
          <Box>
            {favorites.length === 0 ? (
              <Typography level="body-lg" textAlign="center">
                まだお気に入りに追加された名前はありません
              </Typography>
            ) : (
              <Stack spacing={2}>
                {favorites.map((favorite, index) => (
                  <ResultCard
                    key={index}
                    strokeGroup={0}
                    result={favorite}
                    onRemove={() => removeFavorite(favorite.name)}
                  />
                ))}
              </Stack>
            )}
          </Box>
        )}
      </Box>
    </Box>
  );
}

export default App;
