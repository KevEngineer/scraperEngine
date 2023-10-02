const cron = require('node-cron');
const scraper=require('./scrape.js')


cron.schedule('*/3 * * * *', () => {
    
   scraper.runScraper()
// console.log("RUNNING")

})