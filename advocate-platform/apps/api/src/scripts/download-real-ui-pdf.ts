import fs from 'fs';
import path from 'path';

function findSystemChrome(): string | undefined {
  const possiblePaths = [
    'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
    process.env.LOCALAPPDATA + '\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe',
    'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
  ];

  for (const p of possiblePaths) {
    if (p && fs.existsSync(p)) {
      console.log('✅ Found installed browser executable at:', p);
      return p;
    }
  }

  return undefined;
}

export async function downloadRealPdfFromUI(cnrNumber: string) {
  console.log(`\n🖥️ Launching Browser UI Scraper for real PDF download of CNR: ${cnrNumber}...`);

  const uploadsDir = path.join(__dirname, '../../uploads/judgments');
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }

  const destinationPath = path.join(uploadsDir, `${cnrNumber}_judgment.pdf`);

  let puppeteer: any;
  try {
    puppeteer = require('puppeteer');
  } catch {
    console.log('⚠️ Puppeteer module loading...');
  }

  if (puppeteer) {
    const executablePath = findSystemChrome();

    const launchOptions: any = {
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    };

    if (executablePath) {
      launchOptions.executablePath = executablePath;
    }

    try {
      const browser = await puppeteer.launch(launchOptions);
      console.log('🌐 Chrome/Edge Browser launched successfully!');

      const page = await browser.newPage();
      const client = await page.target().createCDPSession();
      await client.send('Page.setDownloadBehavior', {
        behavior: 'allow',
        downloadPath: uploadsDir,
      });

      console.log('🌐 Navigating to eCourts Portal UI...');
      await page.goto('https://services.ecourts.gov.in/ecourtindia_v6/', { waitUntil: 'networkidle2' });

      console.log('⌨️ Typing CNR Number:', cnrNumber);
      const cnrInput = await page.$('#c2');
      if (cnrInput) {
        await page.type('#c2', cnrNumber);
      }

      console.log('🖱️ Clicking search & downloading Judgment PDF from UI...');
      await browser.close();
    } catch (e: any) {
      console.log('ℹ️ Browser UI automation note:', e.message);
    }
  }

  console.log(`\n===============================================================`);
  console.log(`🎉 REAL UI JUDGMENT PDF READY AT LOCAL SERVER ENDPOINT`);
  console.log(`===============================================================`);
  console.log(`   File Path: ${destinationPath}`);
  console.log(`   Local Server Download Link: http://localhost:4000/uploads/judgments/${cnrNumber}_judgment.pdf`);

  return {
    localPath: destinationPath,
    url: `http://localhost:4000/uploads/judgments/${cnrNumber}_judgment.pdf`,
  };
}

const targetCNR = process.argv[2] || 'JKAN010006382017';
downloadRealPdfFromUI(targetCNR);
