import { slugifyStr } from "./slugify";

type PublishableEntry = {
  data: {
    draft?: boolean;
    pubDatetime: Date;
    tags?: string[];
  };
};

export type ContentTag = {
  tag: string;
  tagName: string;
};

export function sortByPublishedDate<T extends PublishableEntry>(
  entries: T[]
): T[] {
  return [...entries].sort(
    (left, right) =>
      new Date(right.data.pubDatetime).getTime() -
      new Date(left.data.pubDatetime).getTime()
  );
}

export function getPublishedEntries<T extends PublishableEntry>(
  entries: T[],
  now = new Date()
): T[] {
  return sortByPublishedDate(
    entries.filter(
      ({ data }) =>
        !data.draft && new Date(data.pubDatetime).getTime() <= now.getTime()
    )
  );
}

export function getUniqueTags<T extends PublishableEntry>(
  entries: T[],
  now = new Date()
): ContentTag[] {
  return entries
    .filter(
      ({ data }) =>
        !data.draft && new Date(data.pubDatetime).getTime() <= now.getTime()
    )
    .flatMap(({ data }) => data.tags ?? [])
    .map(tag => ({ tag: slugifyStr(tag), tagName: tag }))
    .filter(
      (value, index, all) =>
        all.findIndex(candidate => candidate.tag === value.tag) === index
    )
    .sort((left, right) => left.tag.localeCompare(right.tag));
}

export function getEntriesByTag<T extends PublishableEntry>(
  entries: T[],
  tag: string,
  now = new Date()
): T[] {
  return getPublishedEntries(entries, now).filter(({ data }) =>
    (data.tags ?? []).some(candidate => slugifyStr(candidate) === tag)
  );
}
