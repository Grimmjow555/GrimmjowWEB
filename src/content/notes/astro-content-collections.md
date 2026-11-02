---
pubDatetime: 2026-10-18T08:10:00.000Z
title: Astro Content Collections 让内容在构建时报错
description: 用 Zod 定义 frontmatter，把内容错误提前到构建阶段，而不是等浏览器里出现空白。
tags:
  - Astro
  - TypeScript
featured: false
draft: false
---

静态站点不等于放弃类型安全。Astro Content Collections 会在构建时读取 Markdown/MDX，并用 Zod 校验每一条内容。

## 一个最小 Schema

```ts
const noteSchema = z.object({
  title: z.string(),
  pubDatetime: z.coerce.date(),
  tags: z.array(z.string()).min(1),
  draft: z.boolean().optional(),
});
```

如果忘记填写标题、日期格式错误，或者标签不是数组，构建会直接失败。错误出现得越早，修复成本越低。

## 草稿的统一出口

页面、搜索、RSS 和 Sitemap 应该复用同一个公开内容过滤函数。只在页面里隐藏草稿并不够，它仍可能被其他出口暴露。
