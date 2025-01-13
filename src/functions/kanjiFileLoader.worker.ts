import { KanjiInfo } from '@/types/KanjiTypes';

self.onmessage = async () => {
  try {
    const response = await fetch(import.meta.env.BASE_URL + 'kanji.json');
    const kanjiData = await response.json();
    
    const kanjiDict: Record<string, KanjiInfo> = {};
    const strokeGroupedKanji: Record<number, string[]> = {};
    
    kanjiData.kanji.forEach((kanji: { character: string; stroke: number; linkpath: string }) => {
      kanjiDict[kanji.character] = {
        stroke: kanji.stroke,
        linkpath: kanji.linkpath
      };
      
      if (!strokeGroupedKanji[kanji.stroke]) {
        strokeGroupedKanji[kanji.stroke] = [];
      }
      strokeGroupedKanji[kanji.stroke].push(kanji.character);
    });

    self.postMessage({ kanjiDict, strokeGroupedKanji });
  } catch (error: any) {
    self.postMessage({ error: error.message });
  }
};
