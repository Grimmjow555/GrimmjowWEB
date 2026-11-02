import { describe, expect, it } from "vitest";
import {
  getEntriesByTag,
  getPublishedEntries,
  getUniqueTags,
  sortByPublishedDate,
} from "../src/utils/content";

type Entry = {
  id: string;
  data: {
    draft?: boolean;
    pubDatetime: Date;
    tags?: string[];
  };
};

const makeEntry = (
  id: string,
  pubDatetime: string,
  options: Pick<Entry["data"], "draft" | "tags"> = {}
): Entry => ({
  id,
  data: {
    pubDatetime: new Date(pubDatetime),
    ...options,
  },
});

describe("content publishing", () => {
  it("excludes drafts and sorts by publish time descending", () => {
    const entries = [
      makeEntry("older", "2025-01-01T00:00:00.000Z", {
        tags: ["学习"],
      }),
      makeEntry("draft", "2026-01-01T00:00:00.000Z", {
        draft: true,
        tags: ["学习"],
      }),
      makeEntry("newer", "2025-06-01T00:00:00.000Z", {
        tags: ["学习"],
      }),
    ];

    expect(getPublishedEntries(entries).map(entry => entry.id)).toEqual([
      "newer",
      "older",
    ]);
    expect(sortByPublishedDate(entries).map(entry => entry.id)).toEqual([
      "draft",
      "newer",
      "older",
    ]);
  });

  it("builds a sorted, de-duplicated tag index", () => {
    const entries = [
      makeEntry("one", "2025-01-01T00:00:00.000Z", {
        tags: ["TypeScript", "学习"],
      }),
      makeEntry("two", "2025-01-02T00:00:00.000Z", {
        tags: ["typescript", "读书"],
      }),
      makeEntry("draft", "2025-01-03T00:00:00.000Z", {
        draft: true,
        tags: ["草稿"],
      }),
    ];

    expect(getUniqueTags(entries)).toEqual([
      { tag: "typescript", tagName: "TypeScript" },
      { tag: "学习", tagName: "学习" },
      { tag: "读书", tagName: "读书" },
    ]);
  });

  it("returns only published entries matching a tag slug", () => {
    const entries = [
      makeEntry("one", "2025-01-01T00:00:00.000Z", {
        tags: ["TypeScript"],
      }),
      makeEntry("two", "2025-01-02T00:00:00.000Z", {
        tags: ["Astro"],
      }),
      makeEntry("draft", "2025-01-03T00:00:00.000Z", {
        draft: true,
        tags: ["typescript"],
      }),
    ];

    expect(
      getEntriesByTag(entries, "typescript").map(entry => entry.id)
    ).toEqual(["one"]);
  });
});
