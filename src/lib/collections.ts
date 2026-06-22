export type Sortable = { draft?: boolean; date?: string; order?: number };

export function published<T extends Sortable>(items: T[]): T[] {
  return items
    .filter((i) => !i.draft)
    .sort((a, b) => {
      if (
        a.order !== undefined &&
        b.order !== undefined &&
        a.order !== b.order
      ) {
        return a.order - b.order;
      }
      return +new Date(b.date ?? 0) - +new Date(a.date ?? 0);
    });
}
