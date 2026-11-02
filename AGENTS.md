# GrimmjowWEB 项目代理约定

本文件适用于整个仓库。若后续子目录新增自己的 `AGENTS.md`，以距离目标文件更近的说明为准。

## 当前状态

- 当前项目已完成 AstroPaper 7 初始化，并在此基础上建立笔记、作品、碎碎念和静态页面四类内容。
- Node、安装脚本和测试命令以根目录 `.nvmrc`、`package.json` 与锁文件为准。
- 项目目标是搭建一个以中文为主、访客无需登录的静态个人网站，展示学习笔记、作品和碎碎念。

## 固定技术栈

- Node.js `22.23.4` 或更高版本，包管理器使用 `npm`。
- 以 AstroPaper 7 为改造基底，使用 Astro 7、TypeScript、Tailwind CSS 4、Markdown 与 MDX。
- 输出必须是纯静态站点，以 GitHub Pages 为部署目标。
- 保持依赖精简。新增依赖前先确认现有能力无法满足需求，并同步提交锁文件。
- 使用仓库级 `.nvmrc` 固定 Node.js 版本；不要把本机绝对路径写入项目配置。

## 首版边界

- 所有访客均为游客，不提供注册、登录、个人主页或权限角色。
- 不加入自建后台、评论、数据库、服务器 API、访问统计或第三方追踪；内容编辑使用外部 Pages CMS 与 GitHub App。
- 内容通过 `.md`、`.mdx` 和 Git 提交流程发布。
- 不提前加入自定义域名、多语言或复杂交互；这些能力留待后续版本。

## 仓库与改动规则

- 修改前先阅读相关文件、配置和现有实现，遵循 AstroPaper 已有模式。
- 保留用户已有改动，不覆盖或回退无关内容。
- 使用 `apply_patch` 编辑文件，不使用脚本或重定向批量改写源码。
- 不修改或删除环境保留目录：`.git/`、`.agents/`、`.codex/`。
- 不使用 `git reset --hard`、`git checkout --`、递归删除等破坏性命令。
- 不做与当前任务无关的重构；若相关文件已明显过大，可以做局部拆分。
- 依赖、构建命令、部署方式、公共内容字段或视觉令牌发生变化时，必须同步更新 `README.md`、配置示例和相关说明。

## 内容模型

内容统一存放在 `src/content/`，由 Astro Content Collections 和 Zod 在构建时校验。

### 学习笔记 `notes`

- 必填：`title`、`description`、`pubDatetime`、`tags`。
- 可选：`modDatetime`、`featured`、`draft`、`ogImage`。
- 使用 Markdown 或 MDX，支持 Shiki 代码高亮、代码复制、KaTeX 公式和目录。
- 列表和详情路径分别为 `/notes`、`/notes/[slug]`。

### 作品 `projects`

- 必填：`title`、`description`、`pubDatetime`、`cover`、`coverAlt`、`stack`、`status`。
- 可选：`repoUrl`、`demoUrl`、`tags`、`featured`、`draft`。
- `status` 只能是 `active`、`completed` 或 `archived`，界面分别显示“进行中”“已完成”“已归档”。
- 列表和详情路径分别为 `/projects`、`/projects/[slug]`。

### 碎碎念 `thoughts`

- 必填：`pubDatetime` 和正文。
- 可选：`title`、`tags`、`mood`、`draft`。
- 短记直接显示在 `/thoughts` 时间流中，不单独创建详情页。
- 每个条目使用稳定锚点，确保搜索和标签跳转有效。

### 静态页面 `pages`

- 必填：`title` 和正文。
- 可选：`description`、`ogImage`。
- 关于页路径为 `/about`。

### 发布规则

- `draft: true` 的内容不得出现在页面、搜索索引、RSS 或 Sitemap 中。
- 日期使用 ISO 8601，列表按发布时间倒序，修改时间只用于显示更新状态。
- 标签统一去重并生成 `/tags/[tag]`；标签名称中的大小写和空格需要稳定转换。
- 首页只展示少量精选或最新内容；列表页标题、摘要和空状态必须清晰。

## 页面与发现能力

- 主要路由包括 `/`、`/notes`、`/projects`、`/thoughts`、`/about`、`/tags`、`/search`、`/rss.xml` 和 404。
- 使用 Pagefind 建立静态搜索，支持中文关键词、`Ctrl/Cmd+K` 打开和搜索结果分类。
- RSS 至少包含学习笔记和碎碎念，并排除草稿。
- 每个公开页面生成 canonical、Open Graph 和法律允许的站点元数据。
- 生成 Sitemap；不要加入只对作者有用或不应公开的页面。

## 视觉与体验

- 视觉方向是暗色终端极简风：细线边框、低对比网格背景、等宽标题、宽松留白和克制的终端青强调。
- 默认主题必须是暗色；不要依赖系统浅色偏好决定首屏主题，可保留用户主动切换的浅色主题。
- 基础暗色固定为背景 `#07090B`、面板 `#0D1217`、边框 `#26313A`、正文 `#E6EDF3`、终端青 `#22D3EE`；强调色只用于链接、状态和焦点。
- 深色主题使用同一组语义化 CSS 令牌，避免在组件中散落硬编码颜色。
- 后续主题调整应优先替换主题令牌和局部装饰组件，不重写内容查询、路由和内容模型。
- 不依赖境外字体 CDN；标题、正文和代码使用稳定且可降级的字体栈。
- 保持移动端、平板和桌面端可读，避免横向溢出和过长的正文行宽。

## 可访问性与质量

- 使用语义化 HTML、单一主标题、跳至正文链接、可见焦点和键盘可操作菜单。
- 图片必须有替代文本；装饰图使用空替代文本并从辅助技术中隐藏。
- 正文和交互元素满足 WCAG AA 对比度；颜色不能作为唯一状态提示。
- 支持 `prefers-reduced-motion`，关闭自动移动、视差和大幅过渡。
- 代码复制按钮必须报告成功或失败，并可通过键盘触发。
- 确保主题切换不会闪烁，用户选择在本地持久化。

## 初始化后的统一命令

以下命令是脚手架完成后的目标接口，必须与 `package.json` 保持一致：

```bash
npm ci
npm run dev
npm run check
npm run lint
npm run test
npm run build
npm run preview
```

- 开发前先运行 `npm ci`；不要混用 `pnpm`、`yarn` 或 `bun` 生成另一个锁文件。
- 提交前至少运行 `npm run check`、`npm run lint` 和 `npm run build`。
- 修改排序、过滤、标签或路由辅助函数时，运行 `npm run test`。
- 构建必须同时完成 Astro 类型检查、静态页面生成和 Pagefind 索引。
- GitHub Pages 子路径验收使用 `BASE_PATH=/GrimmjowWEB npm run build`，并检查内部链接与静态资源。

## 在线编辑与媒体

- Pages CMS 配置位于根目录 `.pages.yml`；修改内容字段时必须同时更新 Zod Schema、CMS 配置、README 和配置测试。
- Pages CMS 地址由 `site.adminUrl` 集中配置，本站入口为 `/admin/`；管理页必须保持 `noindex, nofollow` 并从 Sitemap 排除。
- 新学习笔记、作品和碎碎念默认 `draft: true`；现有公开内容必须显式设置 `draft: false`。
- 文件名是公开 URL 的 slug，建议使用英文或拼音；页面标题可以继续使用中文。
- 图片上传目录固定为 `public/uploads/`，允许 JPEG、PNG、WebP；不要把临时文件、密钥或非公开资料提交到该目录。
- 不把 GitHub Token、OAuth secret 或其他访问凭证写入仓库。GitHub App 授权由 Pages CMS 托管。
- 保存内容会直接提交 `main`；发布失败时保留上一份线上构建，修复内容或回滚 Git 提交后重新触发 Actions。

## 发布与许可

- GitHub Actions 从 `GITHUB_REPOSITORY` 推导站点地址和 `BASE_PATH`，不要硬编码用户名。
- 环境变量必须可覆盖，以支持后续自定义域名。
- 不提交令牌、私钥、个人邮箱配置或其他秘密；公开内容在提交前按可见内容处理。
- 保留 AstroPaper 的 MIT 许可证、版权声明和 README 来源署名。
- 只有在命令成功且输出已验证后，才能声称构建通过、部署完成或网站可用。
