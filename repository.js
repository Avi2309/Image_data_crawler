let redis = require("redis");

class Repository {

    insertAsync(imgURLArray, keyURL){
        return new Promise(function(resolve, reject){
            let client = redis.createClient(); //creates a new client
            client.on('connect', function() {
                console.log('Redis db server connected');
            });

            client.sadd(keyURL, imgURLArray, function(err, reply) {
                console.log(reply);
            });
        });
    }

}

module.exports = Repository;