import { test, expect } from "@playwright/test";

// Minimal UI smoke test using Playwright.
// These tests don't spin up a React app; they verify DOM structure and
// JSON-LD behavior similar to how the React components render.

test("renders a JSON-LD script tag", async ({ page }) => {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://example.com/" },
      { "@type": "ListItem", position: 2, name: "Docs", item: "https://example.com/docs" },
    ],
  };

  await page.setContent(`<!doctype html><html><head></head><body></body></html>`);
  await page.addScriptTag({
    type: "application/ld+json",
    content: JSON.stringify(jsonLd),
  });

  const scripts = await page.locator('script[type="application/ld+json"]').all();
  await expect(scripts.length).toBeGreaterThan(0);
});

test("renders an accessible breadcrumb nav structure", async ({ page }) => {
  await page.setContent(`
    <!doctype html>
    <html>
      <body>
        <nav aria-label="Breadcrumb">
          <ol>
            <li><a href="/">Home</a></li>
            <li><a href="/products">Products</a></li>
            <li aria-current="page"><span>New</span></li>
          </ol>
        </nav>
      </body>
    </html>
  `);

  const nav = page.getByRole("navigation", { name: "Breadcrumb" });
  await expect(nav).toBeVisible();

  const items = await page.locator("nav[aria-label='Breadcrumb'] li").allTextContents();
  await expect(items).toEqual(["Home", "Products", "New"]);

  const last = page.locator("nav[aria-label='Breadcrumb'] li[aria-current='page']");
  await expect(last).toHaveText("New");
});

test("breadcrumb links navigate via href", async ({ page }) => {
  await page.setContent(`
    <!doctype html>
    <html>
      <body>
        <nav aria-label="Breadcrumb">
          <ol>
            <li><a href="#/home" id="home-link">Home</a></li>
            <li><a href="#/products" id="products-link">Products</a></li>
            <li aria-current="page"><span>New</span></li>
          </ol>
        </nav>
      </body>
    </html>
  `);

  await page.click("#products-link");
  await expect(page).toHaveURL(/#\/products$/);

  await page.click("#home-link");
  await expect(page).toHaveURL(/#\/home$/);
});
