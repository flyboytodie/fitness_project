const { chromium } = require('playwright');
const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 8765;

const server = http.createServer((req, res) => {
  const filePath = path.join(__dirname, 'fitness.html');
  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(500);
      res.end('Error loading file');
      return;
    }
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(data);
  });
});

async function main() {
  server.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });

  const browser = await chromium.launch({ 
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  const page = await browser.newPage();
  
  try {
    await page.goto(`http://localhost:${PORT}`, { waitUntil: 'networkidle', timeout: 30000 });
    console.log('Page loaded successfully!');
    
    const title = await page.title();
    console.log('Page title:', title);
    
    await page.screenshot({ path: 'screenshot.png', fullPage: false });
    console.log('Screenshot saved to screenshot.png');
    
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await browser.close();
    server.close();
  }
}

main().catch(console.error);
