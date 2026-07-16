// End-to-end verification: hero scroll-scrub, pinned features, counters,
// FAQ accordion, and mobile layout. Run with the dev server already up.
import { chromium } from 'playwright';
import { mkdirSync } from 'node:fs';

const URL = process.env.VERIFY_URL || 'http://localhost:5173';
mkdirSync('shots', { recursive: true });

const results = [];
const check = (name, ok, detail = '') => {
  results.push({ name, ok, detail });
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}${detail ? ` — ${detail}` : ''}`);
};

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

const consoleErrors = [];
page.on('console', (m) => m.type() === 'error' && consoleErrors.push(m.text()));
page.on('pageerror', (e) => consoleErrors.push(String(e)));

await page.goto(URL, { waitUntil: 'networkidle' });
await page.waitForTimeout(1500);

// ---- hero scrub ------------------------------------------------------------
await page.screenshot({ path: 'shots/01-hero-top.png' });

const heroST = await page.evaluate(() => window.__heroST);
check('hero ScrollTrigger registered', !!heroST, JSON.stringify(heroST));

async function scrollTo(y) {
  await page.evaluate((yy) => {
    if (window.lenis) window.lenis.scrollTo(yy, { immediate: true });
    else window.scrollTo(0, yy);
  }, y);
  await page.waitForTimeout(900);
}

if (heroST) {
  await scrollTo(heroST.start + (heroST.end - heroST.start) * 0.5);
  const pMid = await page.evaluate(() => window.__heroProgress);
  check('hero scrub reaches mid progress', pMid > 0.35 && pMid < 0.65, `p=${pMid?.toFixed(3)}`);
  await page.screenshot({ path: 'shots/02-hero-mid.png' });

  await scrollTo(heroST.start + (heroST.end - heroST.start) * 0.98);
  const pEnd = await page.evaluate(() => window.__heroProgress);
  check('hero scrub reaches end (dashboard assembled)', pEnd > 0.9, `p=${pEnd?.toFixed(3)}`);
  await page.waitForTimeout(600);
  await page.screenshot({ path: 'shots/03-hero-end.png' });

  // canvas actually painting something purple-ish
  const painted = await page.evaluate(() => {
    const c = document.querySelector('.hero__canvas');
    const ctx = c.getContext('2d');
    const d = ctx.getImageData(0, 0, c.width, c.height).data;
    let lit = 0;
    for (let i = 0; i < d.length; i += 160) {
      if (d[i] + d[i + 1] + d[i + 2] > 60) lit++;
    }
    return lit;
  });
  check('hero canvas is painting', painted > 50, `${painted} lit samples`);
}

// ---- pinned features -------------------------------------------------------
const featST = await page.evaluate(() => window.__featuresST);
check('features ScrollTrigger registered', !!featST, JSON.stringify(featST));

if (featST) {
  const span = featST.end - featST.start;
  const visibleTitle = async () =>
    page.evaluate(() => {
      const blocks = [...document.querySelectorAll('.feature-block')];
      const vis = blocks.find((b) => getComputedStyle(b).visibility !== 'hidden' && +getComputedStyle(b).opacity > 0.5);
      return vis?.querySelector('.feature-block__title')?.textContent || null;
    });

  await scrollTo(featST.start + span * 0.15);
  const f0 = await page.evaluate(() => window.__featureIdx);
  const t0 = await visibleTitle();
  await page.screenshot({ path: 'shots/04-feature-1.png' });

  await scrollTo(featST.start + span * 0.5);
  const f1 = await page.evaluate(() => window.__featureIdx);
  const t1 = await visibleTitle();
  await page.screenshot({ path: 'shots/05-feature-2.png' });

  await scrollTo(featST.start + span * 0.85);
  const f2 = await page.evaluate(() => window.__featureIdx);
  const t2 = await visibleTitle();
  await page.screenshot({ path: 'shots/06-feature-3.png' });

  check('features pin cycles blocks 0→1→2', f0 === 0 && f1 === 1 && f2 === 2, `${t0} / ${t1} / ${t2}`);
}

// ---- metrics counters --------------------------------------------------------
await page.evaluate(() => {
  const el = document.querySelector('#metrics');
  window.lenis
    ? window.lenis.scrollTo(el, { immediate: true, offset: -100 })
    : el.scrollIntoView();
});
await page.waitForTimeout(2600);
const metricTexts = await page.evaluate(() =>
  [...document.querySelectorAll('.metric__value')].map((e) => e.textContent)
);
check(
  'metrics counters reach final values',
  metricTexts[0] === '100%' && metricTexts[1] === '24/7' && metricTexts[2] === '3x',
  metricTexts.join(' · ')
);
await page.screenshot({ path: 'shots/07-metrics.png' });

// ---- product + tiers ---------------------------------------------------------
await page.evaluate(() => {
  const el = document.querySelector('.product');
  window.lenis ? window.lenis.scrollTo(el, { immediate: true }) : el.scrollIntoView();
});
await page.waitForTimeout(900);
await page.screenshot({ path: 'shots/08-product.png' });

await page.evaluate(() => {
  const el = document.querySelector('#access');
  window.lenis ? window.lenis.scrollTo(el, { immediate: true }) : el.scrollIntoView();
});
await page.waitForTimeout(900);
await page.screenshot({ path: 'shots/09-tiers.png' });

// ---- FAQ accordion -----------------------------------------------------------
await page.evaluate(() => {
  const el = document.querySelector('#faq');
  window.lenis ? window.lenis.scrollTo(el, { immediate: true, offset: -60 }) : el.scrollIntoView();
});
await page.waitForTimeout(900);
const q2 = page.locator('.faq__q').nth(1);
await q2.click();
await page.waitForTimeout(600);
const openCount = await page.locator('.faq__item.is-open').count();
const answerVisible = await page.evaluate(() => {
  const item = document.querySelectorAll('.faq__item')[1];
  return item.classList.contains('is-open') && item.querySelector('.faq__a').offsetHeight > 20;
});
check('FAQ accordion opens on click', openCount === 1 && answerVisible, `open items: ${openCount}`);
await page.screenshot({ path: 'shots/10-faq.png' });

// ---- final CTA -----------------------------------------------------------------
await page.evaluate(() => {
  const el = document.querySelector('#cta');
  window.lenis ? window.lenis.scrollTo(el, { immediate: true }) : el.scrollIntoView();
});
await page.waitForTimeout(1200);
await page.screenshot({ path: 'shots/11-cta.png' });

// ---- console errors ------------------------------------------------------------
check('no console errors', consoleErrors.length === 0, consoleErrors.slice(0, 3).join(' | '));

// ---- mobile pass -----------------------------------------------------------------
const mob = await browser.newPage({ viewport: { width: 390, height: 844 } });
const mobErrors = [];
mob.on('pageerror', (e) => mobErrors.push(String(e)));
await mob.goto(URL, { waitUntil: 'networkidle' });
await mob.waitForTimeout(1200);
await mob.screenshot({ path: 'shots/12-mobile-hero.png' });
const hScrollOK = await mob.evaluate(
  () => document.documentElement.scrollWidth <= window.innerWidth + 1
);
check('mobile: no horizontal overflow', hScrollOK);
await mob.evaluate(() => {
  const el = document.querySelector('#metrics');
  window.lenis ? window.lenis.scrollTo(el, { immediate: true }) : el.scrollIntoView();
});
await mob.waitForTimeout(2400);
await mob.screenshot({ path: 'shots/13-mobile-metrics.png' });
check('mobile: no page errors', mobErrors.length === 0, mobErrors.slice(0, 2).join(' | '));

await browser.close();

const failed = results.filter((r) => !r.ok);
console.log(`\n${results.length - failed.length}/${results.length} checks passed`);
process.exit(failed.length ? 1 : 0);
