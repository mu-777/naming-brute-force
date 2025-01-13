export type Result = {
  name: string;
  totalStrokes: number;
};

export type StrokeGroupedResult = Record<number, Result[]>;

export enum SearchMode {
  START_WITH = 'START_WITH',
  END_WITH = 'END_WITH',
  CONTAIN = 'CONTAIN'
}

export enum CharCount {
  TWO = 2,
  THREE = 3
}

export type SearchParams = {
  kanjiInput: string[];
  searchMode: SearchMode;
  charCount: CharCount;
  strokeCounts: number[];
};

export type KanjiInfo = {
  stroke: number;
  linkpath: string;
};

export type KanjiDict = Record<string, KanjiInfo>;
export type StrokeGroupedKanji = Record<number, string[]>;

export type KanjiCache = {
  kanjiDict: KanjiDict;
  strokeGroupedKanji: StrokeGroupedKanji;
  isLoading: boolean;
};

export type ExcludedKanji = {
  character: string;
};