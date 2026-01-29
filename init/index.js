require("dotenv").config();
const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

//  USE ENV VARIABLE (Render + Local)
const dbUrl = process.env.DATABASE_URL;

async function main() {
  await mongoose.connect(dbUrl, {
    serverSelectionTimeoutMS: 30000,
  });
  console.log("Connected to DB");
}

main().catch((err) => console.log("DB ERROR:", err));

const initDB = async () => {
  // clears existing listings (OK for demo)
  await Listing.deleteMany({});

  const listingsWithExtras = initData.data.map((obj) => ({
    ...obj,
    owner: "652d001aea547c5d37e56b5f", // must exist in DB
    geometry: {
      type: "Point",
      coordinates: [-74.006, 40.7128], // NYC
    },
  }));

  await Listing.insertMany(listingsWithExtras);
  console.log("Data was initialized");

  mongoose.connection.close();
};

initDB();
