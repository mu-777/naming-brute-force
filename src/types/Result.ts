export type Result = {
  name: string;
  totalStrokes: number;
};

export type GroupedResults = Record<number, Result[]>;

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
  strokeCounts: number[] | null;
};


export type KanjiData = {
  character: string;
  stroke: number;
  linkpath: string;
};

export type ExcludedKanji = {
  character: string;
};