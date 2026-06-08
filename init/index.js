require("dotenv").config();

const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

const MONGO_URL = process.env.ATLASDB_URL;

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

  const updatedData = initData.data.map((obj) => ({
    ...obj,
    geometry: {
      type: "Point",
      coordinates: [77.2090, 28.6139]
    }
  }));

  await Listing.insertMany(updatedData);

  console.log("data was initialized");
};

initDB();