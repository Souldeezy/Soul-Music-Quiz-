/* Production audit: SMQ_AUDIT_URL=http://localhost:3104 SMQ_PLAYWRIGHT=<path> node scripts/quiz/audit-new-york.cjs */
/* eslint-disable @typescript-eslint/no-require-imports -- Standalone CommonJS test runner. */
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const { chromium } = require(process.env.SMQ_PLAYWRIGHT || 'playwright');
const root = path.resolve(__dirname, '../..');
const base = process.env.SMQ_AUDIT_URL || 'http://localhost:3104';
const database = vm.runInNewContext(fs.readFileSync(path.join(root, 'data/quizzes/new-york-soul.js'), 'utf8').replace('export const newYorkSoulQuestions =', 'globalThis.bank =') + '\nbank;');
const sizes = [[320,600],[375,600],[768,600],[1024,768],[1280,800],[1366,768],[1440,900],[1536,864],[1920,1080],[2580,1440]];
const names = ['Débutant','Novice','Connaisseur','Expert','Soul Legend'];
const selector = name => `[class*="CaliforniaSoulPage_${name}__"]`;
const errors = [];

async function metrics(page) {
  return page.evaluate(() => {
    const find = name => document.querySelector(`[class*="CaliforniaSoulPage_${name}__"]`);
    const measure = el => {
      const css = getComputedStyle(el), box = el.getBoundingClientRect();
      return { width: box.width, height: box.height, font: css.fontSize, weight: css.fontWeight, padding: css.padding, lineHeight: css.lineHeight };
    };
    return {
      overflow: document.documentElement.scrollWidth > innerWidth,
      hero: measure(find('heroMenuQuiz')),
      title: { font: getComputedStyle(find('heroTitle')).fontSize, weight: getComputedStyle(find('heroTitle')).fontWeight },
      subtitle: measure(find('heroTexte')),
      section: measure(find('quizSection')),
      level: measure(find('levelMenu').querySelector('button')),
      cta: measure(document.querySelector('.next-step-section')),
      fallback: document.querySelectorAll('[class*="QuizPage_placeholder__"]').length,
      banners: [document.querySelector('main').children[1], document.querySelector('main').children[3]].map(measure),
      heroImage: getComputedStyle(find('heroMenuQuiz')).backgroundImage,
      ctaImage: getComputedStyle(document.querySelector('.next-step-section')).backgroundImage,
    };
  });
}

(async () => {
  for (const level of Object.values(database)) {
    assert.equal(level.length, 10);
    for (const q of level) { assert(q.options.includes(q.answer)); assert(q.question && q.explanation); }
  }
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  try {
    const page = await browser.newPage();
    page.on('pageerror', e => errors.push(e.message));
    page.on('response', r => { if (r.status() >= 400) errors.push(`${r.status()} ${r.url()}`); });
    for (const [width,height] of (process.env.SMQ_AUDIT_PHASE === 'games' ? [] : process.env.SMQ_AUDIT_PHASE === 'banner' ? [[1440,900]] : sizes)) {
      await page.setViewportSize({ width,height });
      await page.goto(`${base}/quiz/california-soul`, { waitUntil: 'networkidle' });
      const template = await metrics(page);
      await page.goto(`${base}/quiz/new-york-soul`, { waitUntil: 'networkidle' });
      const result = await metrics(page);
      assert(!result.overflow, `overflow ${width}`);
      for (const field of ['hero','title','section','level','cta','fallback','banners']) assert.deepEqual(result[field], template[field], `${field} mismatch ${width}`);
      assert.equal(result.subtitle.font, template.subtitle.font);
      assert.equal(result.subtitle.weight, template.subtitle.weight);
      assert(result.heroImage.includes('/images/quiz/new-york/hero-new-york.webp'));
      assert(result.ctaImage.includes('/images/quiz/new-york/cta-new-york.webp'));
      if (width < 768) assert.equal(await page.locator(`${selector('levelArtPicture')} img`).first().isVisible(), false);
      if (width === 1440) {
        assert.equal(await page.locator('#metro-banner video').count(), 1);
        assert.equal(await page.locator('#food-banner').count(), 1);
        await page.locator('#metro-banner').scrollIntoViewIfNeeded();
        await page.waitForFunction(() => { const v = document.querySelector('#metro-banner video'); return v?.readyState >= 2 && !v.paused && v.currentTime > 0; });
        await page.locator('#food-banner').scrollIntoViewIfNeeded();
        await page.locator('#enter-button').waitFor({ state: 'visible' });
        await page.locator('#enter-button').click();
        await page.waitForFunction(() => getComputedStyle(document.querySelector('#action-menu')).opacity === '1');
        await page.locator('#food-banner .action-button:not(#valider-btn)').click();
        await page.waitForFunction(() => getComputedStyle(document.querySelector('#welcome-text')).opacity === '1');
        await page.waitForTimeout(8000);
        const remnantsAfterQuickExit = await page.locator('#food-banner [class*="effet-"]:not(.effet-logo-welcome)').evaluateAll(items => items.filter(item => getComputedStyle(item).opacity !== '0').map(item => item.className));
        assert.deepEqual(remnantsAfterQuickExit, [], 'food or bags reappeared after quick exit');
        await page.locator('#enter-button').click();
        await page.waitForFunction(() => getComputedStyle(document.querySelector('#action-menu')).opacity === '1');
        await page.waitForFunction(() => getComputedStyle(document.querySelector('.effet-fried-chicken-1')).opacity === '1');
        const food = await page.locator('.effet-fried-chicken-1').boundingBox();
        await page.mouse.move(food.x + food.width / 2, food.y + food.height / 2);
        await page.waitForFunction(() => getComputedStyle(document.querySelector('#food-tooltip')).opacity === '1');
        const tooltip = await page.locator('#food-tooltip').boundingBox();
        const banner = await page.locator('#food-banner').boundingBox();
        assert(tooltip.x >= banner.x && tooltip.y >= banner.y && tooltip.x + tooltip.width <= banner.x + banner.width && tooltip.y + tooltip.height <= banner.y + banner.height, 'price tooltip outside banner');
        assert((await page.locator('#food-tooltip').innerText()).includes('Prix: 5$'));
        await page.mouse.click(food.x + food.width / 2, food.y + food.height / 2);
        await page.waitForFunction(() => document.querySelector('#money-left').textContent !== '50$');
        await page.locator('#valider-btn').click();
        await page.waitForFunction(() => document.querySelector('#final-message'));
        await page.locator('#food-banner .action-button:not(#valider-btn)').click();
        await page.waitForFunction(() => document.querySelector('#money-left').textContent === '50$');
        await page.waitForTimeout(1800);
        const remnantsAfterCheckout = await page.locator('#food-banner [class*="effet-"]:not(.effet-logo-welcome)').evaluateAll(items => items.filter(item => getComputedStyle(item).opacity !== '0').map(item => item.className));
        assert.deepEqual(remnantsAfterCheckout, [], 'food or bags remained after checkout exit');
        console.log('PASS New York video and Connie restaurant purchase/checkout/reset');
      }
      if (process.env.SMQ_AUDIT_PHASE === 'banner') continue;
      await page.getByRole('button', { name: 'Débutant', exact: true }).click();
      await page.getByRole('button', { name: 'Commencer le Quiz', exact: true }).click();
      await page.getByRole('button', { name: 'Valider', exact: true }).click();
      await page.getByRole('alertdialog').waitFor();
      await page.getByRole('button', { name: 'Fermer', exact: true }).click();
      await page.locator(selector('option')).first().click();
      await page.waitForFunction(sel => getComputedStyle(document.querySelector(sel)).backgroundColor === 'rgb(255, 69, 0)', selector('option'));
      await page.getByRole('button', { name: 'Retour à la sélection de niveau', exact: true }).click();
      await page.getByRole('dialog').waitFor();
      await page.getByRole('button', { name: 'Non, continuer', exact: true }).click();
      await page.getByRole('button', { name: 'Retour à la sélection de niveau', exact: true }).click();
      await page.getByRole('dialog').waitFor();
      await page.getByRole('button', { name: 'Oui, quitter', exact: true }).click({ force: true });
      console.log(`PASS ${width}x${height}: California dimensions, assets, selection, dialogs, no overflow`);
    }
    if (process.env.SMQ_AUDIT_PHASE === 'banner') { assert.deepEqual(errors, []); return; }
    await page.goto(`${base}/quiz/new-york-soul`, { waitUntil: 'networkidle' });
    for (const width of [1439,1440,1441,1499,1500,1536,1537]) {
      await page.setViewportSize({ width,height:900 });
      const expected = width === 1440 || (width >= 1500 && width <= 1536);
      await page.waitForFunction(count => document.querySelectorAll('#metro-banner, #food-banner').length === count, expected ? 2 : 0);
      console.log(`PASS banner boundary ${width}`);
    }
    for (const width of [375,1440]) {
      await page.setViewportSize({ width, height: width === 375 ? 600 : 900 });
      await page.goto(`${base}/quiz/new-york-soul`, { waitUntil: 'networkidle' });
      await page.evaluate(() => sessionStorage.setItem('lastScore', 'California sentinel'));
      for (let l = 0; l < names.length; l++) {
        await page.getByRole('button', { name: names[l], exact: true }).click();
        await page.getByRole('button', { name: 'Commencer le Quiz', exact: true }).click();
        const seen = new Set();
        let correct = 0;
        for (let i = 0; i < 10; i++) {
          await page.waitForFunction(([sel, number]) => document.querySelector(sel)?.textContent === `Question ${number} / 10`, [selector('questionCounter'), i + 1]);
          await page.waitForTimeout(480);
          const text = await page.locator(selector('questionText')).innerText();
          const question = database[Object.keys(database)[l]].find(q => q.question === text);
          assert(question && !seen.has(text)); seen.add(text);
          const answer = i === 0 ? question.options.find(o => o !== question.answer) : question.answer;
          if (answer === question.answer) correct++;
          await page.getByRole('button', { name: answer, exact: true }).first().click();
          await page.getByRole('button', { name: 'Valider', exact: true }).click();
          assert((await page.locator(selector('feedback')).innerText()).includes(question.explanation));
          await page.getByRole('button', { name: 'Suivant', exact: true }).click();
        }
        await page.locator(selector('finalScore')).waitFor();
        assert.equal(await page.locator(selector('finalScore')).innerText(), `Votre score est de : ${correct} sur 10`);
        const saved = await page.evaluate(() => ({ last: JSON.parse(sessionStorage.getItem('smq:new-york-soul:lastScore')), untouched: sessionStorage.getItem('lastScore') }));
        assert.equal(saved.last.score, 9);
        assert.equal(saved.untouched, 'California sentinel');
        await page.getByRole('button', { name: 'Recommencer', exact: true }).click();
        await page.getByRole('button', { name: 'Retour à la sélection de niveau', exact: true }).click();
        await page.getByRole('dialog').waitFor();
        await page.getByRole('button', { name: 'Oui, quitter', exact: true }).click({ force: true });
        console.log(`PASS complete quiz ${width} ${Object.keys(database)[l]}: 9/10, feedback, replay, isolated storage`);
      }
    }
    assert.deepEqual(errors, []);
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
