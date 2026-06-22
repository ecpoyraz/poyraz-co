import { notebook } from "#content";

export type Post = (typeof notebook)[number];

export function getPublishedPosts(): Post[] {
  return notebook
    .filter((p) => !p.draft)
    .sort((a, b) => +new Date(b.date) - +new Date(a.date));
}
