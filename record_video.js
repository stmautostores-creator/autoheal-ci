const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

(async () => {
  const outputDir = path.resolve(__dirname, 'recordings');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  console.log('🎥 Launching headless recorder with Playwright...');

  const browser = await chromium.launch({
    headless: true
  });

  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 },
    recordVideo: {
      dir: outputDir,
      size: { width: 1920, height: 1080 }
    }
  });

  const page = await context.newPage();
  const fileUrl = 'file://' + path.resolve(__dirname, 'demo_studio.html');

  console.log(`📡 Loading demo visual studio: ${fileUrl}`);
  await page.goto(fileUrl);

  console.log('⏳ Recording live demo sequence (23 seconds)...');
  await page.waitForTimeout(23000);

  await context.close();
  await browser.close();

  const files = fs.readdirSync(outputDir);
  const latestVideo = files.filter(f => f.endsWith('.webm')).pop();

  console.log('✅ Video captured successfully!');
  console.log(`📁 File location: ${path.join(outputDir, latestVideo)}`);
  console.log('\n💡 Optional: Convert to MP4 via ffmpeg:');
  console.log(`   ffmpeg -i "recordings/${latestVideo}" -c:v libx264 "recordings/autoheal_demo.mp4"`);
})();