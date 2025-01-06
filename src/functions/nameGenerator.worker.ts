import { Result, GroupedResults, SearchParams, KanjiData } from '@/types/Result';


type KanjiJson = {
  domain: string;
  kanji: KanjiData[];
};

self.onmessage = async (e: MessageEvent<SearchParams>) => {
  const { kanjiInput, searchMode, charCount, strokeCount } = e.data;

  const response = await fetch('/kanji.json');
  const data = await response.json() as KanjiJson;
  const cachedKanjiList = data.kanji;
  const cachedInputedKanji = cachedKanjiList.filter(k => kanjiInput.includes(k.character))[0];

  function* generateCombinations(chars: KanjiData[], length: number): Generator<Result> {
    if (length === 2) {
      for (let i = 0; i < chars.length; i++) {
        const name = cachedInputedKanji?.character + chars[i].character;
        const totalStrokes = cachedInputedKanji.stroke + chars[i].stroke;

        // if (strokeCount && totalStrokes !== strokeCount) continue;

        yield { name, totalStrokes };
      }
    } else if (length === 3) {
      for (let i = 0; i < chars.length; i++) {
        for (let j = 0; j < chars.length; j++) {
          const name = cachedInputedKanji?.character + chars[i].character + chars[j].character;
          const totalStrokes = cachedInputedKanji?.stroke + chars[i].stroke + chars[j].stroke;

          if (strokeCount && totalStrokes !== strokeCount) continue;

          yield { name, totalStrokes };
        }
      }
    }
  }

  const generator = generateCombinations(cachedKanjiList, charCount);
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