import { useState, useCallback, useRef, useEffect } from 'react';
import Box from '@mui/joy/Box';
import Header from './components/Header';
import SearchForm from './components/SearchForm';
import Results from './components/Results';
import Tabs from '@mui/joy/Tabs';
import TabList from '@mui/joy/TabList';
import Tab from '@mui/joy/Tab';
import ListItemDecorator from '@mui/joy/ListItemDecorator';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import SearchIcon from '@mui/icons-material/Search';
import { GroupedResults } from '@/types/Result';
import Favorites from '@/components/Favorites';
import { useAtom } from 'jotai';
import { searchParamsAtom } from '@/store/atoms';
import { useResults } from '@/store/atoms';

enum TabType {
  SEARCH = 'SEARCH',
  FAVORITES = 'FAVORITES'
}

function App() {
  const [searchParams, setSearchParams] = useAtom(searchParamsAtom);
  const { updateResults } = useResults();
  const [activeTab, setActiveTab] = useState(TabType.SEARCH);
  const workerRef = useRef<Worker | null>(null);

  const handleSearch = useCallback(() => {
    if (workerRef.current) {
      workerRef.current.terminate();
    }

    workerRef.current = new Worker(
      new URL('./functions/nameGenerator.worker.ts', import.meta.url),
      { type: 'module' }
    );

    workerRef.current.onmessage = (e: MessageEvent<{ type: string; results: GroupedResults }>) => {
      if (e.data.type === 'partial') {
        updateResults(e.data.results);
      }
    };

    workerRef.current.postMessage(searchParams);
  }, [searchParams, updateResults]);

  useEffect(() => {
    return () => {
      if (workerRef.current) {
        workerRef.current.terminate();
      }
    };
  }, []);

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
          searchParams={searchParams}
          setSearchParams={setSearchParams}
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
          onChange={(_, value) => setActiveTab(value as TabType)}
          sx={{
            mb: 2,
            position: 'sticky',
            top: 0,
            backgroundColor: 'white',
            zIndex: 1
          }}
        >
          <TabList>
            <Tab value={TabType.SEARCH}>
              <ListItemDecorator>
                <SearchIcon />
              </ListItemDecorator>
              検索結果
            </Tab>
            <Tab value={TabType.FAVORITES}>
              <ListItemDecorator>
                <FavoriteBorderIcon />
              </ListItemDecorator>
              お気に入り
            </Tab>
          </TabList>
        </Tabs>
        {activeTab === TabType.SEARCH ? (
          <Results />
        ) : (
          <Favorites />
        )}
      </Box>
    </Box>
  );
}

export default App;
