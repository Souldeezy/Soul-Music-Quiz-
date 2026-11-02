/* Run against a production server. Set SMQ_PLAYWRIGHT to an installed Playwright path. */
/* eslint-disable @typescript-eslint/no-require-imports -- Standalone CommonJS test runner. */
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const { chromium } = require(process.env.SMQ_PLAYWRIGHT || 'playwright');
const root = path.resolve(__dirname, '../..');
const base = process.env.SMQ_AUDIT_URL || 'http://localhost:3100';
const output = path.join(root, '.next/memphis-audit');
const database = vm.runInNewContext(fs.readFileSync(path.join(root, 'data/quizzes/memphis-soul.js'), 'utf8').replace('export const memphisSoulQuestions =', 'globalThis.bank =') + '\nbank;');
const sizes = [[320,600],[375,600],[768,600],[1024,768],[1280,800],[1366,768],[1440,900],[1536,864],[1920,1080],[2580,1440]];
const levels = Object.keys(database);
const names = ['Débutant','Novice','Connaisseur','Expert','Soul Legend'];
const selector = (name) => `[class*="CaliforniaSoulPage_${name}__"]`;
const errors = [];
const blockedExternal = [];
const report = { dimensions: [], games: [], errors, blockedExternal };

async function metrics(page) {
  return page.evaluate(() => {
    const find = (name) => document.querySelector(`[class*="CaliforniaSoulPage_${name}__"]`);
    const measure = (el) => {
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
  fs.mkdirSync(output, { recursive: true });
  for (const key of levels) {
    assert.equal(database[key].length, 10);
    for (const q of database[key]) {
      assert(q.options.includes(q.answer));
      assert(q.question && q.explanation);
    }
  }
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  try {
    const context = await browser.newContext();
    const page = await context.newPage();
    page.on('pageerror', e => errors.push(e.message));
    page.on('console', msg => {
      if (msg.type() !== 'error') return;
      const failure = `${msg.text()} ${msg.location().url}`;
      if (failure.includes('kit.fontawesome.com')) blockedExternal.push(failure);
      else errors.push(failure);
    });
    page.on('response', res => { if (res.status() >= 400) errors.push(`${res.status()} ${res.url()}`); });
    for (const [width,height] of (process.env.SMQ_AUDIT_PHASE === 'games' ? [] : sizes.filter(([width]) => width >= Number(process.env.SMQ_AUDIT_MIN_WIDTH || 0)))) {
      await page.setViewportSize({ width,height });
      await page.goto(`${base}/quiz/california-soul`, { waitUntil: 'networkidle' });
      const template = await metrics(page);
      await page.goto(`${base}/quiz/memphis-soul`, { waitUntil: 'networkidle' });
      const memphis = await metrics(page);
      assert(!memphis.overflow, `overflow ${width}`);
      for (const field of ['hero','title','section','level','cta','fallback','banners']) {
        assert.deepEqual(memphis[field], template[field], `${field} mismatch ${width}`);
      }
      assert.equal(memphis.subtitle.font, template.subtitle.font);
      assert.equal(memphis.subtitle.weight, template.subtitle.weight);
      assert(memphis.heroImage.includes('/images/quiz/memphis/hero-memphis.webp'));
      assert(memphis.ctaImage.includes('/images/quiz/memphis/cta-memphis.webp'));
      if (width < 768) {
        assert.equal(await page.locator(`${selector('levelArtPicture')} img`).evaluateAll(imgs => imgs.filter(img => img.currentSrc).length), 0);
        assert.equal(await page.locator(`${selector('levelArtPicture')} img`).first().isVisible(), false);
      }
      if (width === 1440) {
        const banners = page.locator('[class*="MemphisSoulBanner_banner-legal__"]');
        assert.equal(await banners.count(), 2);
        await banners.first().scrollIntoViewIfNeeded();
        await page.waitForTimeout(11000);
        assert.equal(await banners.first().locator('h2').evaluate(el => getComputedStyle(el).opacity), '1');
        assert.equal(await banners.first().locator('[class*="effet-duck-"]').count(), 5);
        assert((await banners.first().locator('[class*="effet-duck-1"]').evaluate(el => getComputedStyle(el).animationName)).includes('duck-crossing'));
        assert((await banners.first().locator('[class*="effet-mississipi-studio"]').evaluate(el => getComputedStyle(el).transform)) !== 'none');
        await banners.first().screenshot({ path: path.join(output, 'banner-mississippi.png') });
        await banners.last().scrollIntoViewIfNeeded();
        await page.waitForTimeout(19000);
        assert.equal(await banners.last().locator('[class*="letter-"]').count(), 11);
        assert.equal(await banners.last().locator('[class*="banner-beale-none"]').evaluate(el => getComputedStyle(el).opacity), '1');
        await banners.last().screenshot({ path: path.join(output, 'banner-beale.png') });
      }
      await page.locator(selector('quizSection')).scrollIntoViewIfNeeded();
      await page.waitForTimeout(800);
      await page.screenshot({ path: path.join(output, `memphis-${width}.png`), fullPage: true });
      // Intro, selected answer styling, dialogs and return flow at every breakpoint.
      await page.getByRole('button', { name: 'Débutant', exact: true }).click();
      await page.getByRole('button', { name: 'Commencer le Quiz', exact: true }).click();
      await page.getByRole('button', { name: 'Valider', exact: true }).click();
      await page.getByRole('alertdialog').waitFor();
      await page.getByRole('button', { name: 'Fermer', exact: true }).click();
      await page.getByRole('alertdialog').waitFor({ state: 'detached' });
      await page.locator(selector('option')).first().click();
      await page.waitForFunction(sel => getComputedStyle(document.querySelector(sel)).backgroundColor === 'rgb(255, 69, 0)', selector('option'));
      assert.equal(await page.locator(selector('option')).first().evaluate(el => getComputedStyle(el).backgroundColor), 'rgb(255, 69, 0)');
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false);
      await page.getByRole('button', { name: 'Retour à la sélection de niveau', exact: true }).click();
      await page.getByRole('dialog').waitFor();
      await page.getByRole('button', { name: 'Non, continuer', exact: true }).click();
      await page.getByRole('dialog').waitFor({ state: 'detached' });
      await page.getByRole('button', { name: 'Retour à la sélection de niveau', exact: true }).click();
      await page.getByRole('button', { name: 'Oui, quitter', exact: true }).click();
      await page.getByRole('dialog').waitFor({ state: 'detached' });
      report.dimensions.push({ width,height,template,memphis });
      console.log(`PASS ${width}x${height}: geometry, assets, fallback, selection, dialogs, overflow`);
    }
    // Check exact shared banner boundaries without inventing a desktop threshold.
    await page.goto(`${base}/quiz/memphis-soul`, { waitUntil: 'networkidle' });
    for (const width of [1439,1440,1441,1499,1500,1536,1537]) {
      await page.setViewportSize({ width,height:900 });
      const expected = width === 1440 || (width >= 1500 && width <= 1536);
      await page.waitForFunction(count => document.querySelectorAll('[class*="MemphisSoulBanner_banner-legal__"]').length === count, expected ? 2 : 0);
      assert.equal(await page.locator('[class*="MemphisSoulBanner_banner-legal__"]').count(), expected ? 2 : 0, `banner boundary ${width}`);
      console.log(`PASS banner boundary ${width}`);
    }
    // Complete every difficulty, on mobile and desktop, including feedback and persisted scores.
    for (const width of [375,1440]) {
      await page.setViewportSize({ width, height: width === 375 ? 600 : 900 });
      await page.goto(`${base}/quiz/memphis-soul`, { waitUntil: 'networkidle' });
      await page.evaluate(() => { sessionStorage.setItem('lastScore', 'California sentinel'); });
      for (let l = 0; l < levels.length; l++) {
        await page.getByRole('button', { name: names[l], exact: true }).click();
        await page.getByRole('button', { name: 'Commencer le Quiz', exact: true }).click();
        const seen = new Set();
        let correct = 0;
        for (let i = 0; i < 10; i++) {
          await page.waitForFunction(([sel, number]) => document.querySelector(sel)?.textContent === `Question ${number} / 10`, [selector('questionCounter'), i + 1]);
          await page.waitForTimeout(480);
          const text = await page.locator(selector('questionText')).innerText();
          const question = database[levels[l]].find(q => q.question === text);
          assert(question, `unknown question ${text}`);
          assert(!seen.has(text)); seen.add(text);
          const answer = i === 0 ? question.options.find(o => o !== question.answer) : question.answer;
          if (answer === question.answer) correct++;
          await page.getByRole('button', { name: answer, exact: true }).click();
          await page.getByRole('button', { name: 'Valider', exact: true }).click();
          assert((await page.locator(selector('feedback')).innerText()).includes(question.explanation));
          await page.getByRole('button', { name: 'Suivant', exact: true }).click();
        }
        await page.locator(selector('finalScore')).waitFor();
        assert.equal(await page.locator(selector('finalScore')).innerText(), `Votre score est de : ${correct} sur 10`);
        const saved = await page.evaluate(() => ({ last: JSON.parse(sessionStorage.getItem('smq:memphis-soul:lastScore')), untouched: sessionStorage.getItem('lastScore') }));
        assert.equal(saved.last.score, 9);
        assert.equal(saved.untouched, 'California sentinel');
        await page.getByRole('button', { name: 'Recommencer', exact: true }).click();
        await page.getByRole('button', { name: 'Commencer le Quiz', exact: true }).waitFor();
        await page.getByRole('button', { name: 'Retour à la sélection de niveau', exact: true }).click();
        await page.getByRole('button', { name: 'Oui, quitter', exact: true }).click();
        await page.getByRole('dialog').waitFor({ state: 'detached' });
        report.games.push({ width,level: levels[l], score: correct });
        console.log(`PASS complete quiz ${width} ${levels[l]}: 9/10, feedback, replay, isolated storage`);
      }
    }
    assert.deepEqual(errors, []);
  } finally {
    fs.writeFileSync(path.join(output, process.env.SMQ_AUDIT_PHASE === 'games' ? 'report-games.json' : 'report.json'), JSON.stringify(report,null,2));
    await browser.close();
  }
})().catch(error => { console.error(error); process.exitCode = 1; });
