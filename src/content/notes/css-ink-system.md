---
pubDatetime: 2026-10-26T11:20:00.000Z
title: 用 CSS 令牌搭一套可换肤的视觉系统
description: 把颜色、字体、边框与阴影收进语义变量，让漫画主题和未来的极客主题共享同一套组件。
tags:
  - CSS
  - 设计系统
featured: true
---

视觉主题不应该散落在每个组件里。页面只关心“背景、正文、强调、边界”，具体是什么颜色交给主题令牌。

## 语义优先

```css
:root {
  --background: #f4f1e8;
  --foreground: #0e0e10;
  --accent: #24dce8;
  --border: #0e0e10;
}

[data-theme="dark"] {
  --background: #0b0d0e;
  --foreground: #edeadf;
}
```

组件使用 `bg-background`、`text-foreground` 和 `border-border`，而不是写死黑白。这样未来切换到终端风时，只需要覆盖变量和少量装饰组件。

## 少即是多

水墨风的关键不是堆叠纹理，而是用大面积留白衬托少量浓墨。电光青只出现在焦点、状态和极小面积的切线上。
