# GrimmjowWEB

一个以黑白水墨漫画为视觉语言的中文个人网站，记录学习笔记、作品和碎碎念。网站使用 Astro 构建为纯静态站点，访客无需登录，内容通过 Markdown/MDX 与 Git 发布。

## 技术栈

- Astro 7 + TypeScript + Tailwind CSS 4
- Astro Content Collections + MDX
- KaTeX 数学公式 + Shiki 代码高亮
- Pagefind 静态搜索
- GitHub Pages 自动部署

## 本地开发

需要 Node.js `22.23.4` 或更高版本。项目使用 npm。

```bash
nvm use
npm ci
npm run dev
```

开发服务器默认运行在 `http://localhost:4321`。

常用命令：

```bash
npm run check
npm run lint
npm run test
npm run build
npm run preview
```

## 在线编辑与发布

网站使用 [Pages CMS](https://app.pagescms.org) 编辑仓库中的 Markdown，不需要数据库或自建后台。

管理入口：

```text
https://app.pagescms.org/Grimmjow555/GrimmjowWEB/main
```

也可以访问本站 `/admin/` 自动跳转。首次使用需要：

1. 使用 GitHub 账号登录 Pages CMS。
2. 安装 Pages CMS GitHub App。
3. 只授权 `Grimmjow555/GrimmjowWEB` 仓库的 Contents 读写权限。

保存内容会直接提交到 `main` 并触发 GitHub Actions。确认内容后取消“草稿”并保存；通常约 1–2 分钟后上线。

- 新建学习笔记、作品和碎碎念默认是草稿。
- 文件名决定公开 URL，建议使用英文或拼音 slug。
- 上传图片保存在 `public/uploads/`，支持 JPEG、PNG 和 WebP。
- 网站不接收发布前预览；检查 CMS 编辑器内容后再取消草稿。
- 发布失败时查看 GitHub Actions；需要恢复时使用 Git 提交历史回滚。
- 网站只保存公开内容。GitHub App 授权和访问凭证由 Pages CMS 管理，不写入仓库。

## 内容目录

| 内容     | 目录                    | 公开路径            |
| -------- | ----------------------- | ------------------- |
| 学习笔记 | `src/content/notes/`    | `/notes/[slug]/`    |
| 作品     | `src/content/projects/` | `/projects/[slug]/` |
| 碎碎念   | `src/content/thoughts/` | `/thoughts/`        |
| 静态页面 | `src/content/pages/`    | `/about/`           |

所有内容在构建时由 Zod 校验。`draft: true` 的内容不会进入页面、搜索或 RSS。

### 新增学习笔记

```yaml
---
pubDatetime: 2026-11-02T10:00:00+08:00
title: 笔记标题
description: 一句话摘要
tags:
  - Astro
  - TypeScript
featured: false
---
```

支持 Markdown、MDX、代码块和 LaTeX：

```md
行内公式：$E = mc^2$
```

### 新增作品

```yaml
---
pubDatetime: 2026-11-02T10:00:00+08:00
title: 项目名称
description: 一句话介绍
cover: /ink/example.svg
coverAlt: 封面图片说明
stack:
  - Astro
  - TypeScript
status: active
repoUrl: https://github.com/example/project
demoUrl: https://example.com
featured: true
---
```

`status` 可取 `active`、`completed` 或 `archived`。

### 新增碎碎念

碎碎念直接显示在时间流中，标题、心情和标签都是可选项：

```yaml
---
pubDatetime: 2026-11-02T10:00:00+08:00
title: 可选标题
tags:
  - 日常
mood: 平静
---
```

## 个性化

- 站点名称、简介、作者、社交链接和首页数量：`astro-paper.config.ts`
- Pages CMS 地址：`astro-paper.config.ts` 中的 `site.adminUrl`
- 颜色、字体和主题令牌：`src/styles/theme.css`
- 首页 Hero：`src/pages/index.astro`
- 原创水墨素材：`public/ink/`

头像和社交链接当前保持为示例状态。填写真实资料后，不需要修改内容模型。

## GitHub Pages

工作流位于 `.github/workflows/deploy-pages.yml`。推送到 `main` 后，它会：

1. 从仓库所有者与仓库名推导 `SITE_URL` 和 `BASE_PATH`。
2. 安装依赖并运行 Lint、单元测试和生产构建。
3. 将 `dist/` 发布到 GitHub Pages。

需要在仓库的 **Settings → Pages → Build and deployment** 中将 Source 设为 **GitHub Actions**。

本地验证项目页子路径：

```bash
BASE_PATH=/GrimmjowWEB npm run build
```

自定义域名可设置 `SITE_URL`，并将 `BASE_PATH` 设为 `/`。

## 隐私

首版不包含登录、评论、数据库、访问统计或第三方追踪。Pagefind 索引和全部页面都在构建时生成。

## 许可

本项目基于 MIT 许可的 [AstroPaper](https://github.com/satnaing/astro-paper) 改造，原始版权与许可见 [LICENSE](./LICENSE)。水墨图形为本项目原创抽象素材，不使用《BLEACH》的角色、标志或原作画面。
