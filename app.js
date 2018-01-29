/**
 * Created by Avi on 19/01/2018.
 */
import {DataCrawler} from "./crawler";
import express from "express";

let app = express();

app.listen(8080, function () {
    console.log('Crawler app is running on port 8080!');
});

app.get('/', function (req, res) {
    res.send('Crawler app is running!');
});

let siteCrawled = process.argv[4];
if(!siteCrawled) {
    console.log("Requested site for crawling isn't found");
    process.exit();
}
console.log(`requested site for crawling is: ${siteCrawled}`);

//initiate new crawler instance
let dataCrawler = new DataCrawler(siteCrawled);
console.log("dataCrawler is initiated");
dataCrawler.start();




















