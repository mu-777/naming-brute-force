export type Result = {
  name: string;
  totalStrokes: number;
};

export type GroupedResults = Record<number, Result[]>;