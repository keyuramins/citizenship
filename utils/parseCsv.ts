import Papa from 'papaparse';

export function parseCsv<T = any>(csvText: string): T[] {
  const { data } = Papa.parse<T>(csvText, { header: true, skipEmptyLines: true });
  return data;
} 