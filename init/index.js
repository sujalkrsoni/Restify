const mongoose = require('mongoose');
const initData = require('./data.js');
const listing = require('../models/listing.js');

const MONGOOSE_URL = "mongodb://127.0.0.1:27017/restify"

main().then(() => {
    console.log("Connect to Db");
    console.log(initData.data);
}).catch((err) => {
    console.log(err);
});

async function main() {
    await mongoose.connect(MONGOOSE_URL);
  }
  

const initDb = async ()=>{ 
    await listing.deleteMany({})
    initData.data = initData.data.map(obj => ({...obj, owner : '6743772cf701dae9a0692023'}));
    await listing.insertMany(initData.data)
    console.log("Data was initialized");
}

initDb()