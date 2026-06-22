import { notebook } from "#content";
import { published } from "@/lib/collections";

export type Post = (typeof notebook)[number];

export function getPublishedPosts(): Post[] {
  return published([...notebook]);
}
