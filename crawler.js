let getImageUrls = require('get-image-urls');
let CrawlerJS = require("js-crawler");
var rep = require('./repository');

class DataCrawler {
    constructor(){
        this.reqCrawlingSite = process.argv[2];
        this.crawler = new CrawlerJS().configure({ignoreRelative: false, depth: 100000});
        this.redisRep = new rep();
    }

    start(){
        this.urlCrawl(this.reqCrawlingSite);
    }

    /**
     * start crawling request site and call for img crawler for every url that has found
     * @param reqCrawlingSite
     */
    urlCrawl(reqCrawlingSite)
    {
        let success = (page)=>{
            console.log(page.url);

            this.imgCrawlAsync(page.url)
                .then(images => {
                    let imagesURLS = [];
                    images.forEach(imageObj => {imagesURLS.push(imageObj.url)});
                    this.redisRep.insertAsync(imagesURLS, page.url);
                })
                .catch(function(err) {
                    console.log(`Error: ${err}`);
                });
        };
        let failure = (page)=>(console.log(page.status));

        if(!reqCrawlingSite){
            console.log("Requested site for crawling isn't found");
            return;
        }
        this.crawler.crawl({
            url: reqCrawlingSite,
            success: function(page) {
                success(page);
            },
            failure: function(page) {
                failure(page);
            },
        });
    }

    /**
     * async crawling for images in specific URL
     * @param URL
     * @returns {Promise<any>}
     */
    imgCrawlAsync(URL){

        return new Promise(function(resolve, reject){
            getImageUrls(URL, function(err, images) {
                if (!err) {
                    console.log(`url: ${URL}. images count: ${images.length}`);
                    resolve(images);
                }
                else{
                    console.log(`Error trying to crawl images for URL: ${URL}. exception: ${err}`);
                    reject(err);
                }

            });
         });
    }
}

module.exports = DataCrawler;