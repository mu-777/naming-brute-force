import { useState, useCallback, useRef, useEffect } from 'react';
import Box from '@mui/joy/Box';
import Header from './components/Header';
import SearchForm from './components/SearchForm';
import Results from './components/Results';
import Tabs from '@mui/joy/Tabs';
import TabList from '@mui/joy/TabList';
import Tab from '@mui/joy/Tab';
import Typography from '@mui/joy/Typography';
import ListItemDecorator from '@mui/joy/ListItemDecorator';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import SettingsIcon from '@mui/icons-material/Settings';
import SearchIcon from '@mui/icons-material/Search';
import { Result } from '@/types/KanjiTypes';
import Favorites from '@/components/Favorites';
import Settings from '@/components/Settings';
import { useAtom } from 'jotai';
import { searchParamsAtom, useKanjiData, useResults } from '@/store/atoms';
import { useExcludedKanji } from '@/hooks/useExcludedKanji';
import Footer from '@/components/Footer';

enum TabType {
  SEARCH = 'SEARCH',
  FAVORITES = 'FAVORITES',
  SETTINGS = 'SETTINGS'
}

const footerPaddingPx = 3;
const footerHeightPx = 32;

function App() {
  const [searchParams, setSearchParams] = useAtom(searchParamsAtom);
  const { excludedKanji } = useExcludedKanji();
  const { results, setResults, updateResults } = useResults();
  const [activeTab, setActiveTab] = useState(TabType.SEARCH);
  const workerRef = useRef<Worker | null>(null);

  const kanjiCache = useKanjiData();

  const handleSearch = useCallback(async () => {
    if (workerRef.current) {
      workerRef.current.terminate();
    }
    if (results && results.length > 0) {
      setResults(null);
    }

    workerRef.current = new Worker(
      new URL('./functions/nameGenerator.worker.ts', import.meta.url),
      { type: 'module' }
    );

    workerRef.current.onmessage = (e: MessageEvent<{ type: string; results: Result[] }>) => {
      if (e.data.type === 'partial') {
        updateResults(e.data.results);
      }
    };

    workerRef.current.postMessage({
      searchParams: searchParams,
      kanjiCache: kanjiCache,
      excludedKanji: excludedKanji
    });

    setActiveTab(TabType.SEARCH);
  }, [searchParams, updateResults, kanjiCache, excludedKanji]);

  useEffect(() => {
    return () => {
      if (workerRef.current) {
        workerRef.current.terminate();
      }
    };
  }, []);

  const handleTabChange = (value: TabType) => {
    setActiveTab(value);
  };


  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        background: 'var(--joy-palette-gradient-background)',
      }}
    >
      <Box
        sx={{
          maxWidth: '1200px',
          width: 'calc(100% - 32px)',
          margin: '0px auto',
          minHeight: `calc(100vh - ${footerHeightPx + 2 * footerPaddingPx}px)`,
          // padding: '24px',
          // '@media (min-width: 600px)': {
          //   width: 'calc(100% - 64px)',
          //   padding: '18px'
          // }
        }}
      >
        <Header />

        <Box
          sx={{
            flexShrink: 0,
            position: 'sticky',
            top: 0,
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(8px)',
            boxShadow: 'var(--joy-shadowRing, 0 0 #000), 0 2px 8px -2px var(--joy-shadowChannel, rgba(0 0 0 / 0.08))',
            zIndex: 10
          }}
        >
          <SearchForm
            kanjiCache={kanjiCache}
            searchParams={searchParams}
            setSearchParams={setSearchParams}
            onSearch={handleSearch}
            isKanjiLoading={kanjiCache.isLoading}
          />

          <Tabs
            value={activeTab}
            onChange={(_, value) => handleTabChange(value as TabType)}
            sx={{
              mb: 2,
              position: 'sticky',
              top: 0,
              backgroundColor: 'var(--joy-palette-background-surface)',
              zIndex: 1,
              margin: '20px auto'
            }}
          >
            <TabList
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
              }}
            >
              <Box sx={{ display: 'flex' }}>
                <Tab value={TabType.SEARCH}>
                  <ListItemDecorator>
                    <SearchIcon />
                  </ListItemDecorator>
                  <Typography level="title-md">検索結果</Typography>
                </Tab>
                <Tab value={TabType.FAVORITES}>
                  <ListItemDecorator>
                    <FavoriteBorderIcon />
                  </ListItemDecorator>
                  <Typography level="title-md">お気に入り</Typography>
                </Tab>
              </Box>

              <Tab value={TabType.SETTINGS}>
                <ListItemDecorator>
                  <SettingsIcon />
                </ListItemDecorator>
                <Typography level="title-md">除外する漢字</Typography>
              </Tab>
            </TabList>
          </Tabs>
        </Box>

        <Box
          sx={{
            flex: 1,
            overflow: 'auto',
            pb: 4,
          }}
        >
          <Box sx={{ display: activeTab === TabType.SEARCH ? 'block' : 'none' }}>
            <Results />
          </Box>
          <Box sx={{ display: activeTab === TabType.FAVORITES ? 'block' : 'none' }}>
            <Favorites />
          </Box>
          <Box sx={{ display: activeTab === TabType.SETTINGS ? 'block' : 'none' }}>
            <Settings />
          </Box>
        </Box>
      </Box>
      <Footer footerHeightPx={footerHeightPx} footerPaddingPx={footerPaddingPx} />
    </Box>
  );
}

export default App;
