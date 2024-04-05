import { Job, Queue, Worker } from "bullmq";
import { db } from "./db";
import { chromium } from "playwright";
import { temporaryDirectory } from "tempy";

const connection = {
  host: process.env.REDIS_HOST || "localhost",
  port: parseInt(process.env.REDIS_PORT!) || 6379,
};

export const productQueue = new Queue("Products", { connection });

const productWorkerProcessor = async (job: Job) => {
  const { url } = job.data;
  const browser = await chromium.launchPersistentContext(temporaryDirectory());
  const page = await browser.newPage();
  await page.goto(url, { waitUntil: "networkidle" });
  const product = await page.evaluate(() => {
    const title = document.querySelector("h1.text-5xl")?.textContent!;
    const price = document.querySelector("h1.text-5xl+div>p")?.textContent!;
    return { title, price };
  });
  await browser.close();

  await db.update(({ products }) => products.push({ ...product, url }));

  return "success";
}

export const productWorker = new Worker(
  "Products",
  productWorkerProcessor,
  { connection }
);