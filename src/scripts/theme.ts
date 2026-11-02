const THEME_KEY = "theme";
const LIGHT = "light";
const DARK = "dark";

function getStoredTheme(): string | null {
  try {
    return localStorage.getItem(THEME_KEY);
  } catch {
    return null;
  }
}

function getPreferredTheme(): string {
  return (
    getStoredTheme() ??
    (window.matchMedia("(prefers-color-scheme: dark)").matches ? DARK : LIGHT)
  );
}

function persist(theme: string): void {
  try {
    localStorage.setItem(THEME_KEY, theme);
  } catch {
    // The visual preference still applies for this page view.
  }
}

let themeValue: string =
  (window as unknown as { __theme?: { value: string } }).__theme?.value ??
  getPreferredTheme();

function reflect(): void {
  const root = document.firstElementChild;
  root?.setAttribute("data-theme", themeValue);
  root?.classList.toggle("dark", themeValue === DARK);

  const button = document.querySelector("#theme-btn");
  const label = themeValue === DARK ? "切换到浅色主题" : "切换到深色主题";
  button?.setAttribute("aria-label", label);
  button?.setAttribute("title", label);

  const background = window.getComputedStyle(document.body).backgroundColor;
  document
    .querySelector("meta[name='theme-color']")
    ?.setAttribute("content", background);
}

document.querySelector("#theme-btn")?.addEventListener("click", () => {
  themeValue = themeValue === LIGHT ? DARK : LIGHT;
  persist(themeValue);
  reflect();
});

reflect();
