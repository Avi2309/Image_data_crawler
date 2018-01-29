import getImageUrls from "get-image-urls";
import CrawlerJS from "js-crawler";
import {Repository} from "./repository";

export class DataCrawler {
    constructor(site){
        this.reqCrawlingSite = site;
        this.crawler = new CrawlerJS().configure({ignoreRelative: false, depth: 100000});
        this.redisRep = new Repository();
    }

    start(){
        console.log("starting crawler...");
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
                    if(imagesURLS.length > 0){
                        this.redisRep.insertAsync(imagesURLS, page.url, this.redisRep)
                            .then((inserted) => console.log(`Successfully insert images urls for key URL: ${page.url}. value inserted: ${inserted}`))
                            .catch((err) => console.log(`Error trying to insert images urls for key url: ${page.url}. ERROR: ${err}`));
                    }
                })
                .catch(function(err) {
                    console.log(`Error trying to crawl images for URL: ${page.url}. exception: ${err}`);
                });
        };
        let failure = (page)=>(console.log(page.status));

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
            });
         });
    }
}
