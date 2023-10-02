//const proxylist = require('./proxies')
const cheerio = require("cheerio");
var axios = require('axios');
const fs = require('fs');
const path = require('path');
var database = require('./knexdb.js');

module.exports = {
    runScraper: async function () {
        // let proxydata = await proxylist.getProxies()
        // console.log(proxydata)
        // let randomProxyNumber = Math.floor(Math.random() * (proxydata.length - 1))
        // let proxyLink = proxydata[randomProxyNumber].ipAddress + ':' + proxydata[randomProxyNumber].port
        // console.log(proxyLink)
        // 80.240.202.218:8080
        let data = fs.readFileSync(path.resolve(__dirname, 'newssources.json'));
        let sources = JSON.parse(data);
        console.log(sources.length)
        for (var index in sources) {

            //let's generate a random proxy

            let proxydata = await database.fetchProxy()
            console.log(proxydata)
            let randomProxyNumber = Math.floor(Math.random() * (proxydata.length - 1))
            let proxyLink = proxydata[randomProxyNumber].proxyValue
            console.log("proxy found", proxyLink)
            console.log(sources[index].link)

            let pageData = await scrapeWebsite(sources[index].link, proxyLink)
            let scrapeTasks = sources[index].scrapeTask
            for (var i in scrapeTasks) {
                console.log("Looping data")
                console.log(scrapeTasks[i])
                let $ = cheerio.load(pageData.data);
                let listItems = $(scrapeTasks[i].scrapeTag)
                // /.sub-title.mb-2 > a
                listItems.each((z, item) => {
                    let title = $(item).text()
                    console.log("Valid URL", isValidUrl($(item).attr().href) ? $(item).attr().href : (new URL(sources[index].link).hostname) + $(item).attr().href)
                    console.log("index", z + 1, title.replace(/([0-9]\shours\sago)|([0-9][0-9]\shours\sago)|([0-9]\shour\sago)|([0-9]\smin\sago)|([0-9][0-9]\smin\sago)/gm, ""), '....', isValidUrl($(item).attr().href) ? $(item).attr().href : (new URL(sources[index].link).hostname) + $(item).attr().href);
                    let newsTitle = title.replace(/([0-9]\shours\sago)|([0-9][0-9]\shours\sago)|([0-9]\shour\sago)|([0-9]\smin\sago)|([0-9][0-9]\smin\sago)/gm, "")
                    let newsLink = isValidUrl($(item).attr().href) ? $(item).attr().href : (new URL(sources[index].link).hostname) + $(item).attr().href
                    // console.log("index", z + 1, title.replace(/([0-9]\shours\sago)|([0-9][0-9]\shours\sago)|([0-9]\shour\sago)|([0-9]\smin\sago)|([0-9][0-9]\smin\sago)/gm,""), '....', isValidUrl($(item).attr().href)?$(item).attr().href:(new URL(sources[index].link).hostname)+$(item).attr().href)
                    database.insertNewsItem(newsTitle, newsTitle, newsLink, "ABC AUTHOR", new Date().getTime())
                    if (z == (scrapeTasks[i].numberPfPosts) - 1) {
                        return false;
                    }
                })
            }


            //load html page with cheerio

        }
    }
}

// (async () => {




// })()

function isValidUrl(string) {
    try {
        new URL(string);
        return true;
    } catch (err) {
        return false;
    }
}

async function scrapeWebsite(link, proxy) {
    return new Promise((resolve, reject) => {
        const AXIOS_OPTIONS = {
            headers: {
                "User-Agent":
                    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/101.0.4951.64 Safari/537.36",

            },

        };

        axios.get(link, AXIOS_OPTIONS).then((data) => {
            resolve(data)
        }).catch(error => {
            reject(error)
        })
    })


}