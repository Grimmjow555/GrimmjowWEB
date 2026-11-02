---
pubDatetime: 2026-11-02T03:00:00.000Z
title: GrimmjowWEB
description: 一个以水墨漫画为视觉语言，记录学习、作品和碎碎念的静态个人网站。
cover: /ink/project-grimmjow.svg
coverAlt: 黑白水墨抽象笔触与电光青斜线
stack:
  - Astro
  - TypeScript
  - Tailwind CSS
status: active
tags:
  - 个人网站
  - 设计系统
featured: true
draft: false
---

GrimmjowWEB 的目标不是做一个标准博客，而是把个人知识、作品和片刻灵感放进同一套视觉叙事里。

## 设计目标

- 首版保持克制、清晰，长文阅读不被装饰干扰。
- 用漫画分镜、浓墨留白和电光青建立辨识度。
- 主题令牌与内容模型分离，未来可以升级成更强烈的极客视觉。

## 技术实现

网站基于 AstroPaper 改造，保留 Astro 的静态渲染、内容集合、Pagefind 搜索、RSS、Sitemap 与 GitHub Pages 发布能力。学习笔记、作品和碎碎念使用独立内容模型，但共享统一的标签与发布时间规则。

公开访客无需登录。内容通过 Git 提交发布，不依赖数据库或外部 CMS。
