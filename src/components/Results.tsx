import { useRef, useEffect, useState } from 'react';
import { useAtomValue } from 'jotai';
import { useVirtualizer } from '@tanstack/react-virtual';
import { resultsAtom } from '@/store/atoms';
import { useFavorites } from '@/hooks/useFavorites';
import ResultCard from './ResultCard';
import Typography from '@mui/joy/Typography';
import Box from '@mui/joy/Box';

const ITEMS_PER_PAGE = 30;

function Results() {
  const results = useAtomValue(resultsAtom);
  const { addFavorite, removeFavorite, isFavorite } = useFavorites();
  const [displayedCount, setDisplayedCount] = useState(ITEMS_PER_PAGE);
  const parentRef = useRef<HTMLDivElement>(null);
  const loadingRef = useRef<HTMLDivElement>(null);

  const rowVirtualizer = useVirtualizer({
    count: Math.min(displayedCount, results?.length || 0),
    getScrollElement: () => parentRef.current,
    estimateSize: () => (results === null || results.length === 0) ? 150 : results[0].name.length === 2 ? 150 : 175,
    overscan: Math.floor(ITEMS_PER_PAGE / 2),
  });

  useEffect(() => {
    const resultLength = (results?.length || 0);
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && displayedCount < resultLength) {
          setDisplayedCount(prev => Math.min(prev + ITEMS_PER_PAGE, resultLength));
        }
      },
      { threshold: 0.1 }
    );

    if (loadingRef.current) {
      observer.observe(loadingRef.current);
    }

    return () => observer.disconnect();
  }, [displayedCount, results?.length]);

  useEffect(() => {
    const handleScroll = () => {
      console.log('handleScroll');
      if (parentRef.current) {
        console.log(parentRef.current.scrollTop);
      }
    };

    const parentElement = parentRef.current;
    parentElement?.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      parentElement?.removeEventListener('scroll', handleScroll);
    };
  }, []);

  if (results === null) {
    return <Typography>条件を入力して検索してください。</Typography>;
  } else if (results.length === 0) {
    return <Typography>条件に合致する組み合わせはありませんでした。</Typography>;
  }

  return (
    <Box
      ref={parentRef}
      sx={{
        height: '100%', overflow: 'auto', margin: '0px', padding: '0px'
      }}>
      <div
        style={{
          height: `${rowVirtualizer.getTotalSize()}px`,
          width: '100%',
          position: 'relative',
        }}
      >
        {rowVirtualizer.getVirtualItems().map((virtualRow) => {
          const result = results[virtualRow.index];
          return (
            <div
              key={virtualRow.index}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: virtualRow.size,
                transform: `translateY(${virtualRow.start}px)`,
              }}
            >
              <ResultCard
                result={result}
                onAddFavorite={addFavorite}
                onRemoveFavorite={removeFavorite}
                isFavorite={isFavorite(result.name)}
              />
            </div>
          );
        })}
      </div>
      {displayedCount < results.length && (
        <div ref={loadingRef} style={{ height: '20px', margin: '10px 0' }}>
          <Typography level="body-sm" textAlign="center">
            読み込み中...
          </Typography>
        </div>
      )}
    </Box>
  );
}

export default Results;