import { Result, CharCount, SearchParams, KanjiCache, SearchMode } from '@/types/KanjiTypes';

self.onmessage = async (e: MessageEvent<{ searchParams: SearchParams; kanjiCache: KanjiCache }>) => {
  const { kanjiInput, searchMode, charCount, strokeCounts } = e.data.searchParams;
  const { kanjiDict, strokeGroupedKanji } = e.data.kanjiCache;

  const inputedKanjiStroke = kanjiInput.reduce((strokeCnt, kanji) => strokeCnt + kanjiDict[kanji].stroke, 0);

  // charCountが3のときは、kanjiInputが2文字ある
  function* generateCombinations(): Generator<Result> {

    const isOnceLoop = (charCount === CharCount.TWO) || (kanjiInput.length === 2);

    if (isOnceLoop) {
      const candidateKanjiList: string[] =
        (charCount - kanjiInput.length) === 1 ?   // 2文字指定で、入力漢字が1つの場合 or 3文字指定で、入力漢字が2つの場合
          strokeCounts.reduce((acc, strokeCount) => {
            const targetStroke = strokeCount - inputedKanjiStroke;
            if (targetStroke in strokeGroupedKanji) {
              acc.push(...strokeGroupedKanji[targetStroke]);
            }
            return acc;
          }, [] as string[])
          : Object.keys(kanjiDict);

      for (const kanji of candidateKanjiList) {
        if (kanjiInput.length === 1 && kanji === kanjiInput[0]) {
          continue;
        }
        const totalStrokes = inputedKanjiStroke + kanjiDict[kanji].stroke;
        if (searchMode === SearchMode.START_WITH) {
          yield { name: kanjiInput + kanji, totalStrokes };
        } else if (searchMode === SearchMode.END_WITH) {
          yield { name: kanji + kanjiInput, totalStrokes };
        } else if (searchMode === SearchMode.CONTAIN) {
          yield { name: kanjiInput + kanji, totalStrokes };
          yield { name: kanji + kanjiInput, totalStrokes };
        }
      }
    } else {
      const candidateKanjiList: string[] = Object.keys(kanjiDict);
      for (const kanji1 of candidateKanjiList) {
        for (const kanji2 of candidateKanjiList) {
          const totalStrokes = inputedKanjiStroke + kanjiDict[kanji1].stroke + kanjiDict[kanji2].stroke;
          if (strokeCounts.length > 0 && !strokeCounts.includes(totalStrokes)) {
            continue;
          }
          if(kanji1 === kanji2 || kanji1 === kanjiInput[0] || kanji2 === kanjiInput[0]) {
            continue;
          }
          if (searchMode === SearchMode.START_WITH) {
            yield { name: kanjiInput + kanji1 + kanji2, totalStrokes };
            yield { name: kanjiInput  + kanji2+ kanji1, totalStrokes };
          } else if (searchMode === SearchMode.END_WITH) {
            yield { name: kanji1 + kanji2 + kanjiInput, totalStrokes };
            yield { name: kanji2 + kanji1 + kanjiInput, totalStrokes };
          } else if (searchMode === SearchMode.CONTAIN) {
            yield { name: kanjiInput + kanji1 + kanji2, totalStrokes };
            yield { name: kanjiInput + kanji2 + kanji1, totalStrokes };
            yield { name: kanji1 + kanji2 + kanjiInput, totalStrokes };
            yield { name: kanji2 + kanji1 + kanjiInput, totalStrokes };
            yield { name: kanji1 + kanjiInput + kanji2, totalStrokes };
            yield { name: kanji2 + kanjiInput + kanji1, totalStrokes };
          }
        }
      }
    }
  }

  const generator = generateCombinations();
  const BATCH_SIZE = 100;
  const DELAY_MS = 10;

  let batch: Result[] = [];
  for (const result of generator) {
    batch.push(result);

    if (batch.length >= BATCH_SIZE) {
      self.postMessage({ type: 'partial', results: batch });
      batch = [];
      await new Promise(resolve => setTimeout(resolve, DELAY_MS));
    }
  }

  if (batch.length > 0) {
    self.postMessage({ type: 'partial', results: batch });
  }

  self.postMessage({ type: 'complete' });
}; 