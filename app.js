/**
 * Created by Avi on 19/01/2018.
 */
let crawler = require('./crawler');
let express = require('express');
let app = express();

app.listen(8080, function () {
    console.log('Crawler app is running on port 8080!');
});

app.get('/', function (req, res) {
    res.send('Crawler app is running!');
});


//initiate new crawler instance
let dataCrawler = new crawler();
dataCrawler.start();




















