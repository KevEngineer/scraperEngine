//const proxylist = require('./proxies')
const cheerio = require("cheerio");
var axios = require('axios');

(async () => {
    // let proxydata = await proxylist.getProxies()
    // console.log(proxydata)
    // let randomProxyNumber = Math.floor(Math.random() * (proxydata.length - 1))
    // let proxyLink = proxydata[randomProxyNumber].ipAddress + ':' + proxydata[randomProxyNumber].port
    // console.log(proxyLink)
    // 80.240.202.218:8080
    let pageData = await scrapeWebsite('https://www.standardmedia.co.ke/', '80.240.202.218:8080')

    //load html page with cheerio
    let $ = cheerio.load(pageData.data);
    let listItems=$('.mb-4 > a')
    listItems.each((index, item) => {
        console.log($(item).text(),'....',$(item).attr().href);
    })
    
    //console.log($('body > div > div > div > main > div > div > div > div > div > div > div > a').text())
    // const listItems = $('.next-topstory-tags').find('a')
    // listItems.each((index,item)=>{
    //     console.log($(item).text());
    // })
    // console.log(listItems.length)
    ////html[1]/body[1]/div[1]/div[2]/div[1]/main[1]/div[1]/div[2]/div[1]/div[1]/div[1]/div[1]/div[2]/div[1]/div[1]/h1[1]/a[1]
    //html/body/div/div/div/main/div/div/div/div/div/div/div/a
    ///html/body/div/div/div/main/div/div/div/div/div/div/div/a
    // console.log($('body > div:eq(1) > div:eq(1) > section:eq(0) > div:eq(0) > div:eq(0) > div:eq(1) > div > div:eq(0) > div > div > div:eq(1) > div:eq(1) > a').text())
    ////html/body/div[2]/div[2]/section[1]/div[1]/div[1]/div[2]/div/div[2]/div/div/div[2]/div[1]/a
    ////html/body/div[2]/div[2]/section[1]/div[1]/div[1]/div[2]/div/div[1]/div/div/div[2]/div[1]/a
    ////html/body/div[2]/div[2]/section[1]/div[1]/div[1]/div[2]/div/div[2]/div/div/div[2]/div[1]/a
    ////html/body/div[2]/div[2]/section[1]/div[1]/div[1]/div[3]/div[1]/div/div/div/div[1]/a
    //html/body/section/section[1]/div/section[2]/ol/li[1]/a
    ////html/body/section/section[1]/div/section[1]/a
    // console.log($('body > section > section:eq(0) > ul > li:eq(0) > section > section:eq(0) > div > ol > li:eq(0) > a').attr());
    //html/body/section/section[1]/ul/li[1]/section/section[1]/div/ol/li[1]/a
    // console.log($('body > section:eq(0) > div > div > div:eq(0) > div:eq(0) > div:eq(1) > small > a').attr());
    // > section > section[1] > ul > li[1] > section > section[1] > div > ol > li[1] > a
    // section[1]/div/div/div[1]/div[1]/div[2]/small/a
    // let titleTeaser=$('body')
    //html/body/section/section[1]/ul/li[1]/section/section[1]/div/ol/li/a
    // console.log(titleTeaser.html())


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