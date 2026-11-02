import { expect, test } from "@playwright/test";

const publicRoutes = [
  "/",
  "/notes/",
  "/notes/learning-in-public/",
  "/projects/",
  "/projects/grimmjowweb/",
  "/thoughts/",
  "/tags/",
  "/tags/astro/",
  "/search/",
  "/about/",
];
const pagesCmsUrl = "https://app.pagescms.org/Grimmjow555/GrimmjowWEB/main";

test("all primary routes render without horizontal overflow", async ({
  page,
}) => {
  for (const route of publicRoutes) {
    const response = await page.goto(route);
    expect(response?.ok(), `${route} should return 2xx`).toBeTruthy();
    await expect(page.locator("main")).toBeVisible();

    const overflow = await page.evaluate(() => {
      const root = document.documentElement;
      return root.scrollWidth - root.clientWidth;
    });
    expect(
      overflow,
      `${route} should not scroll horizontally`
    ).toBeLessThanOrEqual(1);
  }
});

test("theme choice persists across navigation", async ({ page }, testInfo) => {
  await page.goto("/");
  const initialTheme = await page.locator("html").getAttribute("data-theme");
  if (testInfo.project.name === "mobile") {
    await page.locator("#menu-btn").click();
  }
  await page.locator("#theme-btn").click();

  const nextTheme = initialTheme === "dark" ? "light" : "dark";
  await expect(page.locator("html")).toHaveAttribute("data-theme", nextTheme);

  await page.reload();
  await expect(page.locator("html")).toHaveAttribute("data-theme", nextTheme);
});

test("mobile menu exposes all primary sections", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "mobile", "Mobile-only behavior");
  await page.goto("/");

  const menu = page.locator("#menu-items");
  await expect(menu).toBeHidden();
  await page.locator("#menu-btn").click();
  await expect(menu).toBeVisible();

  for (const label of ["笔记", "作品", "碎碎念", "标签", "关于"]) {
    await expect(menu.getByRole("link", { name: label })).toBeVisible();
  }
});

test("note page renders math and provides accessible code copy", async ({
  page,
}) => {
  await page.goto("/notes/learning-in-public/");
  await expect(page.locator(".katex-display")).toBeVisible();

  const copyButton = page.getByRole("button", { name: "复制代码" }).first();
  await expect(copyButton).toBeVisible();
  await copyButton.click();
  await expect(page.locator(".copy-status").first()).toHaveText("代码已复制");
});

test("pagefind returns Chinese content", async ({ page }) => {
  await page.goto("/search/");
  const input = page.locator(".pagefind-ui__search-input");
  await expect(input).toBeVisible();
  await input.fill("公开学习");
  await expect(
    page.locator(".pagefind-ui__result-title").getByText("公开学习")
  ).toBeVisible();
});

test("RSS and sitemap expose the published site", async ({ request }) => {
  const rss = await request.get("/rss.xml");
  expect(rss.ok()).toBeTruthy();
  const rssBody = await rss.text();
  expect(rssBody).toContain("公开学习：从理解到留下痕迹");
  expect(rssBody).toContain("thought-blank-page");

  const sitemap = await request.get("/sitemap-index.xml");
  expect(sitemap.ok()).toBeTruthy();
  expect(await sitemap.text()).toContain("sitemap-0.xml");
});

test("custom 404 page is available", async ({ page }) => {
  const response = await page.goto("/404.html");
  expect(response?.ok()).toBeTruthy();
  await expect(
    page.getByRole("heading", { name: "这一页被墨水吞掉了。" })
  ).toBeVisible();
});

test("unknown route returns the custom 404 page", async ({ page }) => {
  const response = await page.goto("/this-page-does-not-exist/");
  expect(response?.status()).toBe(404);
  await expect(
    page.getByRole("heading", { name: "这一页被墨水吞掉了。" })
  ).toBeVisible();
});

test("internal navigation targets return successful responses", async ({
  page,
  request,
}) => {
  const internalLinks = new Set<string>();

  for (const route of publicRoutes) {
    await page.goto(route);
    const hrefs = await page
      .locator("a[href^='/']")
      .evaluateAll(anchors =>
        anchors.map(anchor =>
          (anchor as HTMLAnchorElement).getAttribute("href")
        )
      );
    for (const href of hrefs) {
      if (!href) continue;
      internalLinks.add(new URL(href, "http://127.0.0.1:4321").pathname);
    }
  }

  for (const pathname of internalLinks) {
    const response = await request.get(pathname);
    expect(response.status(), `${pathname} should resolve`).toBeLessThan(400);
  }
});

test("primary pages emit no browser console errors", async ({ page }) => {
  const errors: string[] = [];
  const externalRequests: string[] = [];
  page.on("console", message => {
    if (message.type() === "error") errors.push(message.text());
  });
  page.on("pageerror", error => errors.push(error.message));
  page.on("request", request => {
    const url = new URL(request.url());
    if (url.origin !== "http://127.0.0.1:4321") externalRequests.push(url.href);
  });

  for (const route of publicRoutes) {
    await page.goto(route);
  }

  expect(errors).toEqual([]);
  expect(externalRequests).toEqual([]);
});

test("admin shortcut points to Pages CMS and is excluded from indexing", async ({
  request,
}) => {
  const response = await request.get("/admin/");
  expect(response.ok()).toBeTruthy();
  const html = await response.text();

  expect(html).toContain('content="noindex, nofollow"');
  expect(html).toContain(pagesCmsUrl);
  expect(html).toContain("进入内容管理");
});

test("footer exposes the content management shortcut", async ({ page }) => {
  await page.goto("/");
  const link = page.getByRole("link", { name: "内容管理" });
  await expect(link).toBeVisible();
  await expect(link).toHaveAttribute("href", pagesCmsUrl);
});

test("admin shortcut is excluded from the sitemap", async ({ request }) => {
  const index = await request.get("/sitemap-index.xml");
  expect(index.ok()).toBeTruthy();
  const sitemapPath = (await index.text()).match(/<loc>(.*?)<\/loc>/)?.[1];
  expect(sitemapPath).toBeTruthy();

  const sitemapUrl = new URL(sitemapPath ?? "");
  const sitemap = await request.get(sitemapUrl.pathname);
  expect(sitemap.ok()).toBeTruthy();
  expect(await sitemap.text()).not.toContain("/admin/");
});
