const mongoose = require ('mongoose');
const initData = require ("./data.js");
const Listing =require("../models/listing.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/wander";

main()
  .then(() => {
    console.log("connected to DB");
})
.catch((err) => {
    console.log(err);
});

async function main() {
    await mongoose.connect(MONGO_URL);
}
const initDB = async () => {
  await Listing.deleteMany({});
  
  initData.data = initData.data.map((obj) => ({
    ...obj,
    owner: "652d001aea547c5d37e56b5f",
    geometry: {
      type: "Point",
      coordinates: [-74.0060, 40.7128]
    }
  }));
  
  await Listing.insertMany(initData.data);
  console.log("data was initialized");
};



initDB();
