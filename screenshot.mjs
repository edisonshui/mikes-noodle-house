import puppeteer from 'puppeteer';
import { readdirSync, mkdirSync } from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';

const DIR = fileURLToPath(new URL('./temporary screenshots', import.meta.url));
mkdirSync(DIR, { recursive: true });

const url = process.argv[2] || 'http://localhost:3000';
const label = process.argv[3] ? `-${process.argv[3]}` : '';

const existing = readdirSync(DIR).filter(f => f.startsWith('screenshot-') && f.endsWith('.png'));
const nums = existing.map(f => parseInt(f.match(/screenshot-(\d+)/)?.[1] || '0')).filter(n => !isNaN(n));
const next = nums.length ? Math.max(...nums) + 1 : 1;
const filename = `screenshot-${next}${label}.png`;

const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 });
await page.goto(url, { waitUntil: 'networkidle0', timeout: 30000 });
await new Promise(r => setTimeout(r, 1200));
const path = join(DIR, filename);
await page.screenshot({ path, fullPage: true });
await browser.close();
console.log(`Saved: temporary screenshots/${filename}`);
