import { expect, test, type Page } from '@playwright/test';

const ORDER = ['home', 'about', 'services', 'klaviyo', 'shopify', 'process', 'experience', 'projects', 'emails', 'testimonials', 'contact'];

/** Collect console errors and uncaught exceptions for the lifetime of the page. */
function trackErrors(page: Page) {
  const errors: string[] = [];
  page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));
  page.on('pageerror', (e) => errors.push(e.message));
  return errors;
}

/** Scroll the whole page in steps so every in-view animation gets a chance to fire. */
async function scrollThrough(page: Page) {
  const height = await page.evaluate(() => document.documentElement.scrollHeight);
  for (let y = 0; y <= height; y += 500) {
    await page.mouse.wheel(0, 500);
    await page.waitForTimeout(90);
  }
  await page.waitForTimeout(1200);
}

test.describe('page', () => {
  test('loads without console errors, in the right order, without excluded sections', async ({ page }) => {
    const errors = trackErrors(page);
    await page.goto('/');
    await expect(page.getByRole('heading', { level: 1 })).toContainText('repeat customers');
    const ids = await page.$$eval('main > section', (els) => els.map((e) => e.id));
    expect(ids).toEqual(ORDER);
    for (const id of ['demo', 'pricing', 'portal', 'faq', 'affiliate']) await expect(page.locator(`#${id}`)).toHaveCount(0);
    await expect(page.getByRole('heading', { name: /pricing|faq|affiliate|questions, answered/i })).toHaveCount(0);
    await scrollThrough(page);
    expect(errors).toEqual([]);
  });

  test('the résumé download is served', async ({ request }) => {
    const res = await request.get('/Bobby-Claridad-Resume.pdf');
    expect(res.status()).toBe(200);
    expect(res.headers()['content-type']).toContain('pdf');
  });

  test('every in-page link resolves and every external action has a real scheme', async ({ page }) => {
    await page.goto('/');
    const hrefs = await page.$$eval('a[href]', (as) => as.map((a) => a.getAttribute('href')!));
    for (const h of hrefs) {
      if (h.startsWith('#')) expect(await page.locator(h).count(), h).toBe(1);
      else expect(h, h).toMatch(/^(mailto:|tel:|https:\/\/calendly\.com\/claridadbobbyjr\/30min$|https:\/\/wa\.me\/639518798280$|https:\/\/mail\.google\.com\/mail\/\?view=cm&|https:\/\/outlook\.live\.com\/mail\/0\/deeplink\/compose\?|\/Bobby-Claridad-Resume\.pdf$)/);
    }
    // external pages open in a new tab and never get a handle on this one
    for (const a of await page.locator('a[href^="https://"]').all()) {
      await expect(a).toHaveAttribute('target', '_blank');
      await expect(a).toHaveAttribute('rel', /noopener/);
    }
  });

  test('no content is left invisible after scrolling the whole page', async ({ page }) => {
    await page.goto('/');
    await scrollThrough(page);
    // Every section heading and every card heading must end fully opaque and un-shifted.
    const stuck = await page.$$eval('main h2, main h3, main p', (els) =>
      els
        .filter((el) => {
          const r = el.getBoundingClientRect();
          if (r.width === 0 || r.height === 0) return false; // collapsed accordion panels etc.
          let node: Element | null = el;
          while (node && node !== document.body) {
            if (parseFloat(getComputedStyle(node).opacity) < 0.99) return true;
            node = node.parentElement;
          }
          return false;
        })
        .map((el) => el.textContent?.slice(0, 50)),
    );
    expect(stuck).toEqual([]);
  });

  test('the background is still: no animated canvas, only the static glow', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('canvas')).toHaveCount(0);
    await expect(page.getByTestId('backdrop')).toHaveCount(1);
  });

  test('the project folder flips between samples and every screenshot loads', async ({ page }) => {
    await page.goto('/');
    const folder = page.getByTestId('project-folder');
    await folder.scrollIntoViewIfNeeded();
    const tabs = folder.getByRole('tab');
    await expect(tabs).toHaveCount(6);
    const titles = new Set<string>();
    let images = 0;
    const panel = page.locator('#sample-panel');
    let previous = '';
    for (let i = 0; i < 6; i++) {
      await tabs.nth(i).click();
      await expect(tabs.nth(i)).toHaveAttribute('aria-selected', 'true');
      // wait for the page flip to finish before reading the new page
      await expect.poll(() => panel.locator('h3').first().textContent()).not.toBe(previous);
      await page.waitForTimeout(500);
      const title = (await panel.locator('h3').first().textContent())!;
      previous = title;
      titles.add(title);
      // the headline number finishes counting and is fully visible
      await expect(panel.getByTestId('headline-stat')).toBeVisible();
      const img = panel.locator('img');
      if (await img.count()) {
        images++;
        await img.first().scrollIntoViewIfNeeded();
        await expect.poll(() => img.first().evaluate((el) => (el as HTMLImageElement).naturalWidth), { timeout: 5000 }).toBeGreaterThan(0);
      }
    }
    expect(titles.size).toBe(6);
    expect(images).toBe(4);
  });

  test('folder tabs are keyboard operable', async ({ page }) => {
    await page.goto('/');
    const tabs = page.getByTestId('project-folder').getByRole('tab');
    await tabs.first().scrollIntoViewIfNeeded();
    await tabs.first().focus();
    await page.keyboard.press('ArrowRight');
    await expect(tabs.nth(1)).toBeFocused();
    await expect(tabs.nth(1)).toHaveAttribute('aria-selected', 'true');
    await expect(page.locator('#sample-panel h3').first()).toHaveText('Checkout recovery that saves the discount for last');
  });

  test('no horizontal overflow at any supported width', async ({ page }) => {
    for (const width of [320, 375, 768, 1024, 1280, 1440, 1920]) {
      await page.setViewportSize({ width, height: 900 });
      await page.goto('/');
      await page.waitForTimeout(400);
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
      expect(overflow, `overflow at ${width}px`).toBeLessThanOrEqual(0);
    }
  });
});

test.describe('navbar and day mode', () => {
  test('the navbar hides while scrolling down and returns on scroll up', async ({ page }) => {
    await page.goto('/');
    const header = page.locator('header').first();
    await expect(header).toHaveAttribute('data-hidden', 'false');
    for (const y of [400, 900, 1500]) {
      await page.evaluate((v) => window.scrollTo(0, v), y);
      await page.waitForTimeout(120);
    }
    await expect(header).toHaveAttribute('data-hidden', 'true');
    await expect.poll(async () => (await header.boundingBox())!.y + (await header.boundingBox())!.height, { timeout: 8000 }).toBeLessThanOrEqual(1);
    await page.evaluate(() => window.scrollTo(0, window.scrollY - 200));
    await expect(header).toHaveAttribute('data-hidden', 'false');
    await expect.poll(async () => (await header.boundingBox())!.y, { timeout: 8000 }).toBeGreaterThanOrEqual(-1);
  });

  test('opens in day mode; night mode toggles, survives a reload and toggles back', async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', (e) => errors.push(e.message));
    await page.goto('/');
    const bg = () => page.evaluate(() => getComputedStyle(document.body).backgroundColor);
    // first visit: white theme
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
    await expect(page.locator('meta[name="theme-color"]')).toHaveAttribute('content', '#fafafa');
    await expect.poll(bg, { timeout: 5000 }).toBe('rgb(250, 250, 250)');
    // mock app windows stay dark in day mode
    const code = page.getByTestId('liquid-code');
    await expect.poll(() => code.evaluate((el) => getComputedStyle(el).color), { timeout: 5000 }).toBe('rgb(250, 250, 250)');
    await page.getByRole('button', { name: 'Switch to night mode' }).click();
    await expect(page.locator('html')).not.toHaveAttribute('data-theme', 'light');
    await expect.poll(bg, { timeout: 3000 }).toBe('rgb(0, 0, 0)');
    await page.reload();
    await expect(page.locator('html')).not.toHaveAttribute('data-theme', 'light');
    await expect(page.locator('meta[name="theme-color"]')).toHaveAttribute('content', '#000000');
    await page.getByRole('button', { name: 'Switch to day mode' }).click();
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
    expect(errors).toEqual([]);
  });
});

test.describe('partners and email designs', () => {
  test('partner logos load', async ({ page }) => {
    await page.goto('/');
    const strip = page.getByTestId('partners');
    await strip.scrollIntoViewIfNeeded();
    const logos = strip.locator('img');
    await expect(logos).toHaveCount(20); // one-colour + original-colour per partner
    await expect.poll(() => logos.evaluateAll((els) => els.every((i) => (i as HTMLImageElement).complete && (i as HTMLImageElement).naturalWidth > 0)), { timeout: 8000 }).toBe(true);
  });

  test('hovering a partner logo shows its original colours', async ({ page, isMobile }) => {
    test.skip(isMobile, 'hover only');
    await page.goto('/');
    const item = page.getByTestId('partner').filter({ has: page.getByAltText('Stone Systems') });
    await item.scrollIntoViewIfNeeded();
    await page.waitForTimeout(900);
    const colour = item.locator('.partner-colour');
    const mono = item.locator('.partner-logo');
    expect(Number(await colour.evaluate((el) => getComputedStyle(el).opacity))).toBeLessThan(0.05);
    await item.hover();
    await expect.poll(async () => Number(await colour.evaluate((el) => getComputedStyle(el).opacity))).toBeGreaterThan(0.95);
    await expect.poll(async () => Number(await mono.evaluate((el) => getComputedStyle(el).opacity))).toBeLessThan(0.05);
    await expect.poll(async () => Number(await item.locator('.partner-tile').evaluate((el) => getComputedStyle(el).opacity))).toBeGreaterThan(0.95);
  });

  test('email viewer opens the full design, steps and closes', async ({ page }) => {
    await page.goto('/');
    const grid = page.getByTestId('email-grid');
    await grid.scrollIntoViewIfNeeded();
    await page.waitForTimeout(800);
    await grid.getByRole('button').first().click();
    const dialog = page.getByTestId('email-viewer');
    await expect(dialog).toBeVisible();
    const img = dialog.locator('img');
    await expect.poll(() => img.evaluate((i) => (i as HTMLImageElement).naturalWidth), { timeout: 10000 }).toBeGreaterThan(1000);
    // the email scrolls inside the dialog, the page does not
    const pageY = await page.evaluate(() => window.scrollY);
    const scroller = dialog.locator('[data-lenis-prevent]');
    await scroller.hover();
    await page.mouse.wheel(0, 1200);
    await expect.poll(() => scroller.evaluate((el) => el.scrollTop), { timeout: 4000 }).toBeGreaterThan(300);
    expect(await page.evaluate(() => window.scrollY)).toBe(pageY);
    await page.keyboard.press('ArrowRight');
    await expect(dialog.getByRole('heading')).toHaveText('Halloween Buy 1, Get 1');
    await page.keyboard.press('Escape');
    await expect(dialog).toHaveCount(0);
  });
});

test.describe('animations', () => {
  test('section label decodes and heading words rise into place', async ({ page }) => {
    await page.goto('/');
    const section = page.locator('#process');
    await section.scrollIntoViewIfNeeded();
    const label = section.getByTestId('scramble-display');
    await expect(label).toHaveText('// process', { timeout: 5000 });
    const word = section.locator('h2 span.overflow-hidden > span').first();
    await expect
      .poll(async () => word.evaluate((el) => new DOMMatrix(getComputedStyle(el).transform).m42), { timeout: 5000 })
      .toBeCloseTo(0, 0);
  });

  test('hero entrance resolves and the stats count up to résumé values', async ({ page }) => {
    await page.goto('/');
    const graph = page.getByTestId('hero-graph');
    await expect(graph).toBeVisible();
    for (const v of ['4+', '6', '5+']) await expect(graph.locator('[aria-hidden="true"]', { hasText: new RegExp(`^${v.replace('+', '\\+')}$`) }).first()).toBeVisible();
    await expect(graph.locator('path[stroke="url(#wf-line)"]')).toHaveCount(6);
  });

  test('scroll progress bar tracks the page', async ({ page }) => {
    await page.goto('/');
    const bar = page.getByTestId('scroll-progress');
    const scaleAt = () => bar.evaluate((el) => new DOMMatrix(getComputedStyle(el).transform).a);
    expect(await scaleAt()).toBeLessThan(0.05);
    await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight / 2));
    await expect.poll(scaleAt, { timeout: 5000 }).toBeGreaterThan(0.3);
  });

  test('reduced motion keeps content, drops travel and the pinned scene', async ({ browser }) => {
    const ctx = await browser.newContext({ reducedMotion: 'reduce', viewport: { width: 1440, height: 900 } });
    const page = await ctx.newPage();
    await page.goto('/');
    await expect(page.getByTestId('services-pinned')).toHaveCount(0);
    await page.locator('#services').scrollIntoViewIfNeeded();
    const card = page.locator('#services article').first();
    await expect(card).toBeVisible();
    const li = card.locator('xpath=ancestor::li[1]');
    // Framer keeps a brief opacity fade under reduced motion but removes all movement.
    await expect.poll(async () => Number(await li.evaluate((el) => getComputedStyle(el).opacity)), { timeout: 3000 }).toBe(1);
    expect(await li.evaluate((el) => getComputedStyle(el).transform)).toMatch(/^(none|matrix\(1, 0, 0, 1, 0, 0\))$/);
    // Labels skip the decode effect and show their final text as soon as they enter view.
    await page.locator('#process').scrollIntoViewIfNeeded();
    await expect(page.locator('#process').getByTestId('scramble-display')).toHaveText('// process', { timeout: 1000 });
    await ctx.close();
  });
});

test.describe('desktop only', () => {
  test.beforeEach(({}, info) => test.skip(info.project.name !== 'desktop', 'desktop layout'));

  test('the menu shows exactly the six requested links', async ({ page }) => {
    await page.goto('/');
    const nav = page.getByRole('navigation', { name: 'Primary' });
    const labels = await nav.locator('ul a').allTextContents();
    expect(labels.map((l) => l.trim())).toEqual(['About', 'Services', 'Experience', 'Projects', 'Testimonials', 'Contact']);
  });

  test('nav click scrolls to the section and moves the active underline', async ({ page }) => {
    await page.goto('/');
    const nav = page.getByRole('navigation', { name: 'Primary' });
    await nav.getByRole('link', { name: 'Experience', exact: true }).click();
    await expect.poll(() => page.evaluate(() => Math.round(document.getElementById('experience')!.getBoundingClientRect().top)), { timeout: 5000 }).toBeLessThan(150);
    await expect(nav.getByRole('link', { name: 'Experience', exact: true })).toHaveAttribute('aria-current', 'true');
    await expect(page).toHaveURL(/#experience$/);
  });

  test('pinned services: cards fly in as the section scrolls', async ({ page }) => {
    await page.goto('/');
    const pinned = page.getByTestId('services-pinned');
    await expect(pinned).toHaveCount(1);
    const cards = pinned.locator('li');
    await expect(cards).toHaveCount(6);
    const top = await pinned.evaluate((el) => el.getBoundingClientRect().top + window.scrollY);
    await page.evaluate((y) => window.scrollTo(0, y), top);
    await page.waitForTimeout(400);
    const lastOpacityStart = Number(await cards.last().evaluate((el) => getComputedStyle(el).opacity));
    expect(lastOpacityStart).toBeLessThan(0.2);
    const height = await pinned.evaluate((el) => (el as HTMLElement).offsetHeight - window.innerHeight);
    await page.evaluate((y) => window.scrollTo(0, y), top + height * 0.97);
    await expect.poll(async () => Number(await cards.last().evaluate((el) => getComputedStyle(el).opacity)), { timeout: 5000 }).toBeGreaterThan(0.95);
  });

  test('hover states respond', async ({ page }) => {
    await page.goto('/');
    const card = page.locator('#projects a[href^="https://calendly.com"]').last();
    await card.scrollIntoViewIfNeeded();
    await page.waitForTimeout(900);
    const before = await card.evaluate((el) => new DOMMatrix(getComputedStyle(el).transform).m42);
    await card.hover();
    await expect.poll(async () => card.evaluate((el) => new DOMMatrix(getComputedStyle(el).transform).m42)).toBeLessThan(before - 3);
  });

  test('experience tabs are keyboard operable', async ({ page }) => {
    await page.goto('/');
    await page.locator('#experience').scrollIntoViewIfNeeded();
    const first = page.getByRole('tab', { name: /The Infused/ });
    await first.focus();
    await page.keyboard.press('ArrowDown');
    await expect(page.getByRole('tab', { name: /Confident Health/ })).toBeFocused();
    await expect(page.locator('#experience').getByRole('tabpanel').getByRole('heading')).toHaveText('Shopify Store Manager');
  });
});

test.describe('mobile only', () => {
  test.beforeEach(({}, info) => test.skip(info.project.name !== 'mobile', 'mobile layout'));

  test('hamburger menu opens, navigates and closes', async ({ page }) => {
    await page.goto('/');
    const nav = page.getByRole('navigation', { name: 'Primary' });
    await expect(nav.getByRole('link', { name: 'Services', exact: true })).toBeHidden();
    await page.getByRole('button', { name: 'Open menu' }).click();
    const menu = page.locator('#mobile-menu');
    await expect(menu).toBeVisible();
    await menu.getByRole('link', { name: 'Projects', exact: true }).click();
    await expect(menu).toBeHidden();
    await expect.poll(() => page.evaluate(() => Math.round(document.getElementById('projects')!.getBoundingClientRect().top)), { timeout: 5000 }).toBeLessThan(200);
  });

  test('hero visual stacks above the headline and CTAs are full-width', async ({ page }) => {
    await page.goto('/');
    const graphBox = await page.getByTestId('hero-graph').boundingBox();
    const h1Box = await page.getByRole('heading', { level: 1 }).boundingBox();
    expect(graphBox!.y).toBeLessThan(h1Box!.y);
    const cta = await page.getByRole('link', { name: 'Book a Call', exact: true }).boundingBox();
    expect(cta!.width).toBeGreaterThan(300);
  });
});
