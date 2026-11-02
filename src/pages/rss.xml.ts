import rss from "@astrojs/rss";
import { getCollection } from "astro:content";
import { getRelativeLocaleUrl } from "astro:i18n";
import { getPublishedEntries } from "@/utils/content";
import config from "@/config";

function summarizeMarkdown(body: string) {
  return body
    .replace(/```[\s\S]*?```/g, "")
    .replace(/[#>*_`[\]()]/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 180);
}

export async function GET() {
  const [notes, thoughts] = await Promise.all([
    getCollection("notes"),
    getCollection("thoughts"),
  ]);
  const entries = getPublishedEntries([...notes, ...thoughts]);
  const locale = config.site.lang;
  const absoluteLink = (path: string) => new URL(path, config.site.url).href;

  return rss({
    title: config.site.title,
    description: config.site.description,
    site: config.site.url,
    customData: "<language>zh-CN</language>",
    items: entries.map(entry => {
      if (entry.collection === "notes") {
        return {
          title: entry.data.title,
          description: entry.data.description,
          link: absoluteLink(
            getRelativeLocaleUrl(locale, `notes/${entry.id}/`)
          ),
          pubDate: new Date(entry.data.pubDatetime),
        };
      }

      return {
        title: entry.data.title ?? "碎碎念",
        description: summarizeMarkdown(entry.body ?? ""),
        link: absoluteLink(
          `${getRelativeLocaleUrl(locale, "thoughts/")}#thought-${entry.id}`
        ),
        pubDate: new Date(entry.data.pubDatetime),
      };
    }),
  });
}
