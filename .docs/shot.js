import { chromium } from 'playwright';
import path from 'path';
import fs from 'fs';

function loadEnv(file) {
  if (!fs.existsSync(file)) return;
  const lines = fs.readFileSync(file, 'utf8').split('\n');
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eq = trimmed.indexOf('=');
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    const val = trimmed.slice(eq + 1).trim().replace(/^["']|["']$/g, '');
    if (!(key in process.env)) process.env[key] = val;
  }
}

const scriptDir = path.dirname(new URL(import.meta.url).pathname);
loadEnv(path.join(scriptDir, '.env.default'));
loadEnv(path.join(scriptDir, '.env'));

const BASE = (process.env.SHOT_BASE_URL || 'http://localhost:2412').replace(/\/+$/, '');
const rawOut = process.env.SHOT_OUT_DIR || './screenshots';
const OUT = path.isAbsolute(rawOut) ? rawOut : path.join(scriptDir, rawOut);
const VIEWPORT = { width: 1300, height: 2000 };
const THEMES = (process.env.SHOT_THEMES || 'light,dark').split(',').map((s) => s.trim()).filter(Boolean);

const ROUTES = [
  { name: 'start', hash: '#/', waitSelector: '.view--home' },
  { name: 'chronik', hash: '#/chronik', waitSelector: '.view--chronik' },
  { name: 'events', hash: '#/events', waitSelector: '.view--events' },
  { name: 'akteure', hash: '#/akteure', waitSelector: '.view--akteure' },
  { name: 'traditionen', hash: '#/traditionen', waitSelector: '.view--traditionen' },
  { name: 'quellen', hash: '#/quellen', waitSelector: '.view--quellen' },
];

const log = (...a) => console.log('[shot]', ...a);

async function goto(page, url) {
  await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
}

async function scrollToTop(page) {
  await page.evaluate(() => {
    document.documentElement.style.scrollBehavior = 'auto';
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  });
  await page.waitForTimeout(150);
}

async function shot(page, file) {
  await scrollToTop(page);
  await page.screenshot({ path: file, animations: 'disabled' });
  log(path.relative(process.cwd(), file));
}

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const launchOptions = { headless: true, args: ['--no-sandbox', '--disable-cache'] };
  if (process.env.SHOT_CHROME_PATH) launchOptions.executablePath = process.env.SHOT_CHROME_PATH;
  const browser = await chromium.launch(launchOptions);

  for (const theme of THEMES) {
    const context = await browser.newContext({
      viewport: VIEWPORT,
      deviceScaleFactor: 1,
      reducedMotion: 'reduce',
    });
    const page = await context.newPage();

    await goto(page, BASE + '/');
    await page.waitForSelector('.view--home', { timeout: 20000 });

    if (theme === 'dark') {
      await page.click('[data-theme-toggle]');
      await page.waitForFunction(() => document.documentElement.classList.contains('dark'), { timeout: 10000 });
      await page.waitForTimeout(200);
    }

    for (const route of ROUTES) {
      await goto(page, BASE + route.hash);
      await page.waitForSelector(route.waitSelector, { timeout: 20000 });
      await page.waitForLoadState('networkidle', { timeout: 10000 }).catch(() => {});
      await page.waitForTimeout(400);
      await shot(page, path.join(OUT, `${route.name}-${theme}.png`));
    }

    await context.close();
  }

  await browser.close();
})().catch((e) => {
  console.error('FATAL', e);
  process.exit(1);
});
