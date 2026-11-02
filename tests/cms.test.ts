import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { parse } from "yaml";

const readConfig = () => parse(readFileSync(".pages.yml", "utf8"));

const getField = (
  collection: { fields?: Array<Record<string, unknown>> },
  name: string
) => collection.fields?.find(field => field.name === name);

const readFrontmatter = (path: string) => {
  const source = readFileSync(path, "utf8");
  const match = source.match(/^---\n([\s\S]*?)\n---/);
  if (!match) throw new Error(`Missing frontmatter: ${path}`);
  return parse(match[1]);
};

describe("Pages CMS configuration", () => {
  it("maps all content collections to their existing Astro paths", () => {
    const cms = readConfig();
    const collections = Object.fromEntries(
      cms.content.map((collection: { name: string }) => [
        collection.name,
        collection,
      ])
    );

    expect(cms.media.input).toBe("public/uploads");
    expect(cms.media.output).toBe("/uploads");
    expect(cms.media.extensions).toEqual(["jpg", "jpeg", "png", "webp"]);

    expect(collections.notes).toMatchObject({
      type: "collection",
      path: "src/content/notes",
      format: "yaml-frontmatter",
    });
    expect(collections.projects).toMatchObject({
      type: "collection",
      path: "src/content/projects",
      format: "yaml-frontmatter",
    });
    expect(collections.thoughts).toMatchObject({
      type: "collection",
      path: "src/content/thoughts",
      format: "yaml-frontmatter",
    });
    expect(collections.about).toMatchObject({
      type: "file",
      path: "src/content/pages/about.md",
      format: "yaml-frontmatter",
    });
  });

  it("exposes the expected form fields and publishing defaults", () => {
    const cms = readConfig();
    const collections = Object.fromEntries(
      cms.content.map((collection: { name: string }) => [
        collection.name,
        collection,
      ])
    );

    for (const collection of [
      collections.notes,
      collections.projects,
      collections.thoughts,
    ]) {
      expect(getField(collection, "draft")).toMatchObject({
        type: "boolean",
        default: true,
      });
      expect(getField(collection, "body")).toMatchObject({
        type: "rich-text",
        required: true,
      });
    }

    expect(getField(collections.notes, "tags")).toMatchObject({
      type: "string",
      list: true,
      required: true,
    });
    expect(getField(collections.projects, "cover")).toMatchObject({
      type: "image",
      required: true,
    });
    expect(getField(collections.projects, "status")).toMatchObject({
      type: "select",
      required: true,
      options: [
        { label: "进行中", value: "active" },
        { label: "已完成", value: "completed" },
        { label: "已归档", value: "archived" },
      ],
    });
    expect(getField(collections.thoughts, "title")?.required).toBeFalsy();
    expect(getField(collections.about, "body")?.type).toBe("rich-text");
  });

  it("marks every existing public entry as explicitly published", () => {
    for (const collection of ["notes", "projects", "thoughts"]) {
      const directory = join("src/content", collection);
      for (const file of readdirSync(directory).filter(name =>
        name.endsWith(".md")
      )) {
        expect(readFrontmatter(join(directory, file)).draft).toBe(false);
      }
    }
  });
});
