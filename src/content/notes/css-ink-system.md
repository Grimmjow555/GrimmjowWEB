---
pubDatetime: 2026-10-26T11:20:00.000Z
title: 用 CSS 令牌搭一套可换肤的视觉系统
description: 把颜色、字体、边框与阴影收进语义变量，让暗色终端主题和未来的视觉方向共享同一套组件。
tags:
  - CSS
  - 设计系统
featured: true
draft: false
---

视觉主题不应该散落在每个组件里。页面只关心“背景、正文、强调、边界”，具体是什么颜色交给主题令牌。

## 语义优先

```css
:root,
[data-theme="dark"] {
  --background: #07090b;
  --foreground: #e6edf3;
  --accent: #22d3ee;
  --border: #26313a;
}
```

组件使用 `bg-background`、`text-foreground` 和 `border-border`，而不是写死颜色。这样调整主题时，只需要覆盖变量和少量装饰组件。

## 少即是多

极简终端风的关键不是堆叠装饰，而是清晰的层级、稳定的对比和克制的强调色。
