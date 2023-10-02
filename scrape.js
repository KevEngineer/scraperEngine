//const proxylist = require('./proxies')
const cheerio = require("cheerio");
var axios = require('axios');
const fs = require('fs');
const path = require('path');
var database = require('./knexdb.js');

(async () => {
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
        if (index == 4) {
            break;
        }
        //let's generate a random proxy
        let proxydata = await database.fetchProxy()
        console.log(proxydata)
        let randomProxyNumber = Math.floor(Math.random() * (proxydata.length - 1))
        let proxyLink = proxydata[randomProxyNumber].proxyValue
        console.log("proxy found",proxyLink)
        console.log(sources[index].link)
        
        let pageData = await scrapeWebsite(sources[index].link,proxyLink)
        let scrapeTasks = sources[index].scrapeTask
        for (var i in scrapeTasks) {
            console.log("Looping data")
            console.log(scrapeTasks[i])
            let $ = cheerio.load(pageData.data);
            let listItems = $(scrapeTasks[i].scrapeTag)
            // /.sub-title.mb-2 > a
            listItems.each((index, item) => {
                console.log("index", index + 1, $(item).text(), '....', $(item).attr().href);
                if (index == (scrapeTasks[i].numberPfPosts) - 1) {
                    return false;
                }
            })
        }
        //load html page with cheerio

    }



})()

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