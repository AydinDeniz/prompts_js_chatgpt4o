
// Import Puppeteer
const puppeteer = require('puppeteer');

// Function to scrape data from a list of URLs
async function scrapeData(urls) {
    const browser = await puppeteer.launch({ headless: true });
    const results = [];

    for (const url of urls) {
        const page = await browser.newPage();
        await page.goto(url, { waitUntil: 'domcontentloaded' });

        try {
            // Wait for the element to load (customize the selector as needed)
            await page.waitForSelector('h1');

            // Extract data from specific elements (customize selectors as needed)
            const data = await page.evaluate(() => {
                return {
                    title: document.querySelector('h1')?.innerText || '',
                    description: document.querySelector('meta[name="description"]')?.content || '',
                    firstParagraph: document.querySelector('p')?.innerText || ''
                };
            });

            results.push({ url, data });

        } catch (error) {
            console.log(`Error scraping ${url}:`, error);
            results.push({ url, error: error.message });
        } finally {
            await page.close();
        }
    }

    await browser.close();
    return results;
}

// Sample list of URLs to scrape
const urls = [
    'https://example.com',
    'https://example.org',
    'https://example.net'
];

// Run the scraping function and log the results
scrapeData(urls).then(results => {
    console.log(JSON.stringify(results, null, 2));
}).catch(error => console.error('Error in scraping:', error));
