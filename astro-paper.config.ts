import { defineAstroPaperConfig } from "./src/types/config";

const siteOrigin = process.env.SITE_URL ?? "http://localhost:4321";
const basePath = process.env.BASE_PATH ?? "/";
const siteUrl = `${siteOrigin.replace(/\/+$/, "")}${
  basePath === "/" ? "" : basePath.replace(/\/+$/, "")
}`;

export default defineAstroPaperConfig({
  site: {
    url: siteUrl,
    title: "Grimmjow",
    description: "记录学习、作品与偶尔冒出的碎碎念。",
    author: "Grimmjow",
    ogImage: "default-og.jpg",
    lang: "zh-CN",
    timezone: "Asia/Shanghai",
    dir: "ltr",
  },
  content: {
    perPage: 8,
    homeNotes: 3,
    homeProjects: 3,
    homeThoughts: 3,
  },
  features: {
    lightAndDarkMode: true,
    dynamicOgImage: false,
    showArchives: false,
    showBackButton: true,
    editPost: {
      enabled: false,
    },
    search: "pagefind",
  },
  socials: [],
  shareLinks: [],
});
