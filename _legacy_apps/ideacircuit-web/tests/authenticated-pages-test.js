import puppeteer from 'puppeteer';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function testIdeaCircuitPages() {
  console.log('🚀 Starting IdeaCircuit Page Testing with Authentication...');
  
  const browser = await puppeteer.launch({
    headless: false, // Set to true for headless mode
    defaultViewport: { width: 1280, height: 720 },
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  try {
    const page = await browser.newPage();
    
    // Navigate to the application
    const baseUrl = process.env.BASE_URL || 'http://localhost:5173';
    console.log(`📍 Navigating to: ${baseUrl}`);
    
    await page.goto(baseUrl, { waitUntil: 'networkidle2' });
    
    // Wait for page to load
    await page.waitForSelector('body');
    console.log('✅ Page loaded successfully');
    
    // Take initial screenshot
    await page.screenshot({ path: 'screenshots/01-homepage.png' });
    console.log('📸 Screenshot: Homepage');
    
    // Check if we're on the homepage
    const isHomepage = await page.$('h1');
    if (isHomepage) {
      const title = await page.$eval('h1', el => el.textContent);
      console.log(`🏠 Homepage title: ${title}`);
    }
    
    // Look for login/signup links
    console.log('🔍 Looking for authentication links...');
    
    // Try to find login link
    const loginLink = await page.$('a[href="/login"]');
    if (loginLink) {
      console.log('✅ Found login link, clicking...');
      await loginLink.click();
      await page.waitForNavigation({ waitUntil: 'networkidle2' });
      
      // Take screenshot of login page
      await page.screenshot({ path: 'screenshots/02-login-page.png' });
      console.log('📸 Screenshot: Login page');
      
      // Check if we're on login page
      const loginTitle = await page.$eval('h2', el => el.textContent);
      console.log(`🔐 Login page title: ${loginTitle}`);
      
      // Fill in login credentials
      console.log('📝 Filling login credentials...');
      
      // Use test credentials
      const email = 'test@ideacircuit.ai';
      const password = 'TestPass123!';
      
      await page.type('input[name="email"]', email);
      await page.type('input[name="password"]', password);
      
      // Take screenshot before login
      await page.screenshot({ path: 'screenshots/03-login-filled.png' });
      console.log('📸 Screenshot: Login form filled');
      
      // Click login button
      const loginButton = await page.$('button[type="submit"]');
      if (loginButton) {
        console.log('🔑 Clicking login button...');
        await loginButton.click();
        
        // Wait for navigation or error
        try {
          await page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 10000 });
          console.log('✅ Login successful, navigated to authenticated page');
        } catch (error) {
          console.log('⚠️ No navigation after login, checking for errors...');
          
          // Check for error messages
          const errorElement = await page.$('.text-red-700, .text-red-600, [class*="error"]');
          if (errorElement) {
            const errorText = await page.evaluate(el => el.textContent, errorElement);
            console.log(`❌ Login error: ${errorText}`);
          }
        }
        
        // Take screenshot after login attempt
        await page.screenshot({ path: 'screenshots/04-after-login.png' });
        console.log('📸 Screenshot: After login attempt');
      }
    } else {
      console.log('❌ Login link not found, checking if already authenticated...');
      
      // Check if we're already on an authenticated page
      const navMenu = await page.$('[class*="NavigationMenu"]');
      if (navMenu) {
        console.log('✅ Already authenticated, found navigation menu');
      }
    }
    
    // Now test all the pages
    console.log('🧪 Testing all application pages...');
    
    const pagesToTest = [
      { path: '/presentation', name: 'Presentation Call' },
      { path: '/report', name: 'Data Report' },
      { path: '/marketing-report', name: 'Marketing Report' },
      { path: '/business-profile', name: 'Business Profile' },
      { path: '/data-analytics', name: 'Data Analytics' },
      { path: '/client-proposal', name: 'Client Proposal' },
      { path: '/ai-workflow', name: 'AI Workflow' },
      { path: '/fae-create', name: 'FAE Create' },
      { path: '/files', name: 'Files' },
      { path: '/schedule', name: 'Schedule' },
      { path: '/profile', name: 'Profile' }
    ];
    
    for (let i = 0; i < pagesToTest.length; i++) {
      const pageInfo = pagesToTest[i];
      console.log(`\n🔍 Testing page ${i + 1}/${pagesToTest.length}: ${pageInfo.name}`);
      
      try {
        // Navigate to the page
        await page.goto(`${baseUrl}${pageInfo.path}`, { waitUntil: 'networkidle2' });
        
        // Wait a moment for page to load
        await page.waitForTimeout(2000);
        
        // Take screenshot
        const screenshotPath = `screenshots/page-${String(i + 5).padStart(2, '0')}-${pageInfo.name.toLowerCase().replace(/\s+/g, '-')}.png`;
        await page.screenshot({ path: screenshotPath });
        console.log(`📸 Screenshot: ${pageInfo.name}`);
        
        // Check if page loaded successfully
        const pageTitle = await page.title();
        console.log(`📄 Page title: ${pageTitle}`);
        
        // Check for error messages
        const errorElement = await page.$('[class*="error"], .text-red-600, .text-red-700');
        if (errorElement) {
          const errorText = await page.evaluate(el => el.textContent, errorElement);
          console.log(`⚠️ Page error: ${errorText}`);
        }
        
        // Check for loading states
        const loadingElement = await page.$('[class*="loading"], [class*="spinner"]');
        if (loadingElement) {
          console.log('⏳ Page still loading...');
          await page.waitForTimeout(3000); // Wait for loading to complete
        }
        
        // Look for key elements on each page
        const mainContent = await page.$('main, [class*="content"], [class*="container"]');
        if (mainContent) {
          console.log('✅ Main content found');
        } else {
          console.log('⚠️ No main content found');
        }
        
        // Check for navigation menu
        const navMenu = await page.$('[class*="NavigationMenu"], [class*="nav"]');
        if (navMenu) {
          console.log('✅ Navigation menu found');
        } else {
          console.log('⚠️ No navigation menu found');
        }
        
        // Special checks for FAE Create page
        if (pageInfo.path === '/fae-create') {
          const faeBuilder = await page.$('[class*="FAESolutionBuilder"], [class*="fae"]');
          if (faeBuilder) {
            console.log('✅ FAE Solution Builder found');
          } else {
            console.log('⚠️ FAE Solution Builder not found');
          }
        }
        
        console.log(`✅ ${pageInfo.name} page test completed`);
        
      } catch (error) {
        console.log(`❌ Error testing ${pageInfo.name}: ${error.message}`);
      }
    }
    
    // Test navigation menu functionality
    console.log('\n🧭 Testing navigation menu...');
    
    // Look for navigation menu button
    const navButton = await page.$('button[aria-label*="Navigation"], [class*="menu"] button');
    if (navButton) {
      console.log('✅ Found navigation menu button');
      await navButton.click();
      await page.waitForTimeout(1000);
      
      // Take screenshot of open menu
      await page.screenshot({ path: 'screenshots/navigation-menu-open.png' });
      console.log('📸 Screenshot: Navigation menu open');
      
      // Check for menu items
      const menuItems = await page.$$('a[href]');
      console.log(`🔗 Found ${menuItems.length} navigation links`);
      
      // Close menu
      await navButton.click();
      await page.waitForTimeout(500);
    } else {
      console.log('⚠️ Navigation menu button not found');
    }
    
    console.log('\n🎉 Testing completed!');
    console.log('📁 Screenshots saved in ./screenshots/ directory');
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  } finally {
    await browser.close();
  }
}

// Run the test
testIdeaCircuitPages().catch(console.error);

export { testIdeaCircuitPages };
