import { chromium } from 'playwright';
import { mkdirSync, writeFileSync } from 'node:fs';

const URL = 'https://iris-growth-pulse.base44.app/';
mkdirSync('shots/old-site', { recursive: true });

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto(URL, { waitUntil: 'networkidle', timeout: 60000 });
await page.waitForTimeout(3000);

// scroll through the whole page to trigger lazy content
await page.evaluate(async () => {
  for (let y = 0; y < document.body.scrollHeight; y += 600) {
    window.scrollTo(0, y);
    await new Promise((r) => setTimeout(r, 150));
  }
  window.scrollTo(0, 0);
});
await page.waitForTimeout(1500);

// full text content, structured
const data = await page.evaluate(() => {
  const out = { title: document.title, url: location.href, sections: [] };
  const meta = document.querySelector('meta[name="description"]');
  out.metaDescription = meta?.content || null;

  // headings + their text
  out.headings = [...document.querySelectorAll('h1,h2,h3,h4')].map((h) => ({
    tag: h.tagName,
    text: h.innerText.trim(),
  }));

  // buttons and links
  out.ctas = [...document.querySelectorAll('a,button')]
    .map((e) => e.innerText.trim())
    .filter((t) => t && t.length < 60);

  // nav items
  out.nav = [...document.querySelectorAll('nav a, nav button, header a, header button')].map((e) =>
    e.innerText.trim()
  );

  // full visible body text
  out.fullText = document.body.innerText;

  // detect colors/fonts
  const styles = getComputedStyle(document.body);
  out.bodyStyle = { background: styles.backgroundColor, color: styles.color, font: styles.fontFamily };

  return out;
});

writeFileSync('shots/old-site/content.json', JSON.stringify(data, null, 2), 'utf8');

// full-page screenshot + viewport shots
await page.screenshot({ path: 'shots/old-site/full.png', fullPage: true });
const height = await page.evaluate(() => document.body.scrollHeight);
const vh = 900;
for (let i = 0; i * vh < height && i < 12; i++) {
  await page.evaluate((y) => window.scrollTo(0, y), i * vh);
  await page.waitForTimeout(500);
  await page.screenshot({ path: `shots/old-site/view-${String(i).padStart(2, '0')}.png` });
}

console.log('Page height:', height);
console.log('Headings:', data.headings.length);
console.log('Text length:', data.fullText.length);
await browser.close();
