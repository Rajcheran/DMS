const mongodb = require('mongodb')
const mongoclient = mongodb.MongoClient;

let _db;

const mongoconnect = (callback) => {
    //mongoclient.connect('mongodb+srv://rajashekarcse45:Atlas%4010@cluster0.sscgl.mongodb.net/')
    mongoclient.connect('mongodb://localhost:27017/')
        .then(client => {
            console.log('connected');
            _db=client.db('delivery')
            callback();
        })
        .catch(err => {
            console.log(err);
            throw err;
        });

 }
const getdb=()=>{
    if(_db){
        return _db
    }
    throw 'no database found'
}
exports.mongoconnect=mongoconnect;
exports.getdb=getdb