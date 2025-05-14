// Duplicate an array until it reaches at least the desired length
export function duplicateToLength<T>(arr: T[], minLength: number): T[] {
  if (arr.length === 0) throw new Error("Cannot duplicate empty array");
  const result = [...arr];
  while (result.length < minLength) {
    result.push(...arr.slice(0, Math.min(arr.length, minLength - result.length)));
  }
  return result.slice(0, minLength);
}

// Split an array into chunks of a given size
export function chunk<T>(arr: T[], size: number): T[][] {
  const res = [];
  for (let i = 0; i < arr.length; i += size) {
    res.push(arr.slice(i, i + size));
  }
  return res;
}

// Shuffle an array in place (Fisher-Yates)
export function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
} 