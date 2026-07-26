// End-to-end verification of the V2 landing: hero scrub, I.R.I.S. pinned
// method (4 steps), real-figure counters, ROI simulator interactivity,
// FAQ accordion, contact form, and mobile layout.
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

async function scrollTo(y) {
  await page.evaluate((yy) => {
    if (window.lenis) window.lenis.scrollTo(yy, { immediate: true });
    else window.scrollTo(0, yy);
  }, y);
  await page.waitForTimeout(900);
}

// ---- hero scrub ------------------------------------------------------------
await page.screenshot({ path: 'shots/01-hero-top.png' });
const heroST = await page.evaluate(() => window.__heroST);
check('hero ScrollTrigger registered', !!heroST, JSON.stringify(heroST));

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

// ---- metrics (real figures) ------------------------------------------------
await page.evaluate(() => {
  const el = document.querySelector('#metrics');
  window.lenis ? window.lenis.scrollTo(el, { immediate: true, offset: -100 }) : el.scrollIntoView();
});
await page.waitForTimeout(2800);
const metricTexts = await page.evaluate(() =>
  [...document.querySelectorAll('.metric__value')].map((e) => e.textContent)
);
check(
  'metrics counters reach real final values',
  metricTexts[0] === "14'202+" &&
    metricTexts[1] === '4,8x' &&
    metricTexts[2] === '38' &&
    metricTexts[3] === '100%',
  metricTexts.join(' · ')
);
await page.screenshot({ path: 'shots/04-metrics.png' });

// ---- I.R.I.S. pinned method (4 steps) -------------------------------------
const featST = await page.evaluate(() => window.__featuresST);
check('méthode ScrollTrigger registered', !!featST, JSON.stringify(featST));

if (featST) {
  const span = featST.end - featST.start;
  const idxAt = async (f) => {
    await scrollTo(featST.start + span * f);
    return page.evaluate(() => window.__featureIdx);
  };
  const i0 = await idxAt(0.1);
  await page.screenshot({ path: 'shots/05-methode-I.png' });
  const i1 = await idxAt(0.35);
  const i2 = await idxAt(0.6);
  await page.screenshot({ path: 'shots/06-methode-3.png' });
  const i3 = await idxAt(0.9);
  await page.screenshot({ path: 'shots/07-methode-S.png' });
  check('méthode I.R.I.S. cycles 0→1→2→3', i0 === 0 && i1 === 1 && i2 === 2 && i3 === 3, `${i0}/${i1}/${i2}/${i3}`);
}

// ---- pillars ---------------------------------------------------------------
await page.evaluate(() => {
  const el = document.querySelector('#piliers');
  window.lenis ? window.lenis.scrollTo(el, { immediate: true, offset: -60 }) : el.scrollIntoView();
});
await page.waitForTimeout(900);
const pillarCount = await page.locator('.pillar').count();
check('3 pillars render', pillarCount === 3, `${pillarCount} pillars`);
await page.screenshot({ path: 'shots/08-pillars.png' });

// ---- simulator -------------------------------------------------------------
await page.evaluate(() => {
  const el = document.querySelector('#simulateur');
  window.lenis ? window.lenis.scrollTo(el, { immediate: true, offset: -40 }) : el.scrollIntoView();
});
await page.waitForTimeout(1400);
const roiDefault = await page.evaluate(() => window.__simRoi);
check('simulator default matches original calibration (+140%)', roiDefault === 140, `roi=${roiDefault}`);

// move the budget slider → ROI must change
await page.evaluate(() => {
  const input = document.querySelector('#sim-budget');
  const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
  setter.call(input, 10000);
  input.dispatchEvent(new Event('input', { bubbles: true }));
});
await page.waitForTimeout(1200);
const roiAfter = await page.evaluate(() => window.__simRoi);
check('simulator reacts to budget change', roiAfter !== 140 && typeof roiAfter === 'number', `roi=${roiAfter}`);

// switch sector → ROI changes again
await page.locator('.sim__sector', { hasText: 'E-commerce' }).click();
await page.waitForTimeout(1200);
const roiSector = await page.evaluate(() => window.__simRoi);
check('simulator reacts to sector change', typeof roiSector === 'number' && roiSector !== roiAfter, `roi=${roiSector}`);
await page.screenshot({ path: 'shots/09-simulator.png' });

// ---- app section -----------------------------------------------------------
await page.evaluate(() => {
  const el = document.querySelector('#app');
  window.lenis ? window.lenis.scrollTo(el, { immediate: true }) : el.scrollIntoView();
});
await page.waitForTimeout(900);
const appFeatures = await page.locator('.app-feature').count();
check('app section shows 6 features', appFeatures === 6, `${appFeatures} features`);
await page.screenshot({ path: 'shots/10-app.png' });

// ---- FAQ -------------------------------------------------------------------
await page.evaluate(() => {
  const el = document.querySelector('#faq');
  window.lenis ? window.lenis.scrollTo(el, { immediate: true, offset: -60 }) : el.scrollIntoView();
});
await page.waitForTimeout(900);
const faqCount = await page.locator('.faq__item').count();
await page.locator('.faq__q').nth(1).click();
await page.waitForTimeout(600);
const answerVisible = await page.evaluate(() => {
  const item = document.querySelectorAll('.faq__item')[1];
  return item.classList.contains('is-open') && item.querySelector('.faq__a').offsetHeight > 20;
});
check('FAQ has 6 real questions and opens on click', faqCount === 6 && answerVisible, `${faqCount} items`);
await page.screenshot({ path: 'shots/11-faq.png' });

// ---- contact ---------------------------------------------------------------
await page.evaluate(() => {
  const el = document.querySelector('#contact');
  window.lenis ? window.lenis.scrollTo(el, { immediate: true }) : el.scrollIntoView();
});
await page.waitForTimeout(1300);
const formOk = await page.evaluate(() => {
  const form = document.querySelector('.contact__form');
  return (
    !!form &&
    form.querySelectorAll('input').length === 3 &&
    form.querySelectorAll('textarea').length === 1 &&
    !!document.querySelector('.contact__coords')
  );
});
check('contact form + real coordinates render', formOk);
await page.screenshot({ path: 'shots/12-contact.png' });

// ---- console errors --------------------------------------------------------
check('no console errors', consoleErrors.length === 0, consoleErrors.slice(0, 3).join(' | '));

// ---- mobile pass -----------------------------------------------------------
const mob = await browser.newPage({ viewport: { width: 390, height: 844 } });
const mobErrors = [];
mob.on('pageerror', (e) => mobErrors.push(String(e)));
await mob.goto(URL, { waitUntil: 'networkidle' });
await mob.waitForTimeout(1200);
await mob.screenshot({ path: 'shots/13-mobile-hero.png' });
const hScrollOK = await mob.evaluate(
  () => document.documentElement.scrollWidth <= window.innerWidth + 1
);
check('mobile: no horizontal overflow', hScrollOK);
await mob.evaluate(() => {
  const el = document.querySelector('#simulateur');
  window.lenis ? window.lenis.scrollTo(el, { immediate: true }) : el.scrollIntoView();
});
await mob.waitForTimeout(1400);
await mob.screenshot({ path: 'shots/14-mobile-simulator.png' });
check('mobile: no page errors', mobErrors.length === 0, mobErrors.slice(0, 2).join(' | '));

await browser.close();

const failed = results.filter((r) => !r.ok);
console.log(`\n${results.length - failed.length}/${results.length} checks passed`);
process.exit(failed.length ? 1 : 0);
