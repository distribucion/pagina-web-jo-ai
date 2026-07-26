import { chromium } from 'playwright';

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
await page.goto('http://localhost:5173', { waitUntil: 'networkidle' });
await page.waitForTimeout(1500);

const offenders = await page.evaluate(() => {
  const vw = window.innerWidth;
  const bad = [];
  document.querySelectorAll('*').forEach((el) => {
    const r = el.getBoundingClientRect();
    if (r.width > 0 && (r.right > vw + 2 || r.left < -2) && r.width < 5000) {
      bad.push({
        tag: el.tagName,
        cls: String(el.className).slice(0, 60),
        left: Math.round(r.left),
        right: Math.round(r.right),
        w: Math.round(r.width),
      });
    }
  });
  return { vw, scrollW: document.documentElement.scrollWidth, bad: bad.slice(0, 20) };
});
console.log(JSON.stringify(offenders, null, 2));
await browser.close();
