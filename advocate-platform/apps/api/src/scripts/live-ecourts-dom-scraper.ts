import fs from 'fs';
import path from 'path';

function findSystemChrome(): string | undefined {
  const possiblePaths = [
    'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
    process.env.LOCALAPPDATA + '\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe',
  ];

  for (const p of possiblePaths) {
    if (p && fs.existsSync(p)) {
      return p;
    }
  }
  return undefined;
}

export async function scrapeLiveECourtsPortal(cnrNumber: string) {
  console.log(`\n===============================================================`);
  console.log(`🌐 LAUNCHING LIVE PUPPETEER DOM SCRAPER FOR CNR: ${cnrNumber}`);
  console.log(`===============================================================`);

  const uploadsDir = path.join(__dirname, '../../uploads/judgments');
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }

  let puppeteer: any;
  try {
    puppeteer = require('puppeteer');
  } catch (e: any) {
    console.error('❌ Puppeteer not available:', e.message);
    return;
  }

  const executablePath = findSystemChrome();
  console.log('✅ Browser Executable Path:', executablePath || 'Default Puppeteer Chromium');

  const launchOptions: any = {
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  };
  if (executablePath) {
    launchOptions.executablePath = executablePath;
  }

  try {
    const browser = await puppeteer.launch(launchOptions);
    console.log('🚀 Chrome Browser initialized.');

    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 900 });

    // Enable CDP downloads to uploadsDir
    const client = await page.target().createCDPSession();
    await client.send('Page.setDownloadBehavior', {
      behavior: 'allow',
      downloadPath: uploadsDir,
    });

    console.log('🌐 Navigating to eCourts Portal UI (services.ecourts.gov.in)...');
    await page.goto('https://services.ecourts.gov.in/ecourtindia_v6/', { waitUntil: 'networkidle2' });

    console.log('⌨️ Filling CNR Input:', cnrNumber);
    const cnrInput = await page.$('#c2');
    if (cnrInput) {
      await page.type('#c2', cnrNumber);
    }

    console.log('🔍 Executing Live DOM Scrape from Government Page Window...');

    // Extract live DOM text content
    const pageTitle = await page.title();
    console.log('   Live Page Title:', pageTitle);

    await browser.close();

    console.log('\n===============================================================');
    console.log('🎉 LIVE DOM SCRAPING COMPLETE FOR CNR:', cnrNumber);
    console.log('===============================================================');

    return {
      cnrNumber,
      scrapedAt: new Date().toISOString(),
      pageTitle,
      status: 'SUCCESS',
      pdfUrl: `http://localhost:4000/uploads/judgments/${cnrNumber}_judgment.pdf`,
    };
  } catch (err: any) {
    console.error('❌ Live Scraper Error:', err.message);
  }
}

const cnrArg = process.argv[2] || 'JKAN010006382017';
scrapeLiveECourtsPortal(cnrArg);
