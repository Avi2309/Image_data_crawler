import redis from "redis";

export class Repository {

    static INSTANCE = null;

    constructor(){
        try{
            if (this.INSTANCE){
                return this.INSTANCE;
            }
            this.INSTANCE = this;
            this.client = new redis.createClient(); //creates a new client
            this.client.on('connect', function() {
                console.log('Redis db server connected');
            });
        }
        catch(e){
            console.log(`Error initiating rep instance. ERROR: ${e}`);
        }
    }

    insertAsync(imgURLArray, keyURL, redisRep){
        return new Promise((resolve, reject) => {
            let imgURLArrayJSON = JSON.stringify(imgURLArray);
            redisRep.client.set(keyURL, JSON.stringify(imgURLArrayJSON), function(err, reply) {
                console.log(reply);
            });
            resolve(imgURLArrayJSON);
        });
    }

}
