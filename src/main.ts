import { temporaryDirectory } from "tempy";
import { db } from "./db";
import { productQueue, productWorker } from "./queue";
import { chromium } from "playwright-chromium";

const url = "https://demo.vercel.store/";

(async () => {
  const browser = await chromium.launchPersistentContext(temporaryDirectory());
  const page = await browser.newPage();
  await page.goto(url);

  await page.click('a[href="/search"]');
  await page.waitForURL("https://demo.vercel.store/search", { waitUntil: "networkidle" });

  const categoryLinks = await page
    .locator("nav", { has: page.locator("h3", { hasText: "Collections" }) })
    .locator("ul li:not(:first-child) a")
    .evaluateAll((links: HTMLAnchorElement[]) =>
      links.map((link) => ({ name: link.textContent!, url: link.href }))
    );
  console.log({ categoryLinks });
  await db.update(({ categories }) => categories.push(...categoryLinks));

  const productLinks = await page
    .locator("ul.grid > li.aspect-square > a")
    .evaluateAll((links: HTMLAnchorElement[]) => links.map((link) => link.href));
  console.log({ productLinks });

  for (const link of productLinks) {
    await productQueue.add("collectingLinks", { url: link }, { jobId: link });
  }

  await browser.close();
})();

productWorker.on("failed", (jobId, error) => {
  console.error(`Job ${jobId} failed with error: ${error}`);
});