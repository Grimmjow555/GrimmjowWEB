import { defineCollection } from "astro:content";
import { z } from "astro/zod";
import { glob } from "astro/loaders";
import config from "@/config";

export const CONTENT_PATHS = {
  notes: "src/content/notes",
  projects: "src/content/projects",
  thoughts: "src/content/thoughts",
  pages: "src/content/pages",
} as const;

const notes = defineCollection({
  loader: glob({
    pattern: "**/[^_]*.{md,mdx}",
    base: `./${CONTENT_PATHS.notes}`,
  }),
  schema: ({ image }) =>
    z.object({
      author: z.string().default(config.site.author),
      pubDatetime: z.coerce.date(),
      modDatetime: z.coerce.date().optional().nullable(),
      title: z.string(),
      featured: z.boolean().optional(),
      draft: z.boolean().optional(),
      tags: z.array(z.string()).min(1),
      ogImage: image().or(z.string()).optional(),
      description: z.string(),
      canonicalURL: z.url().optional(),
      hideEditPost: z.boolean().optional(),
      timezone: z
        .string()
        .optional()
        .transform(tz => tz || undefined),
    }),
});

const projects = defineCollection({
  loader: glob({
    pattern: "**/[^_]*.{md,mdx}",
    base: `./${CONTENT_PATHS.projects}`,
  }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDatetime: z.coerce.date(),
    modDatetime: z.coerce.date().optional().nullable(),
    cover: z.string(),
    coverAlt: z.string(),
    stack: z.array(z.string()).min(1),
    status: z.enum(["active", "completed", "archived"]),
    repoUrl: z.url().optional(),
    demoUrl: z.url().optional(),
    tags: z.array(z.string()).default([]),
    featured: z.boolean().optional(),
    draft: z.boolean().optional(),
  }),
});

const thoughts = defineCollection({
  loader: glob({
    pattern: "**/[^_]*.{md,mdx}",
    base: `./${CONTENT_PATHS.thoughts}`,
  }),
  schema: z.object({
    pubDatetime: z.coerce.date(),
    title: z.string().optional(),
    tags: z.array(z.string()).default([]),
    mood: z.string().optional(),
    draft: z.boolean().optional(),
  }),
});

const pages = defineCollection({
  loader: glob({
    pattern: "**/[^_]*.{md,mdx}",
    base: `./${CONTENT_PATHS.pages}`,
  }),
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    ogImage: z.string().optional(),
    canonicalURL: z.url().optional(),
  }),
});

export const collections = { notes, projects, thoughts, pages };
