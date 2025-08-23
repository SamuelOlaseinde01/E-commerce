require("dotenv").config();
const express = require("express");
const products = require("./products");
const connectDb = require("./db/connectDb");
const Products = require("./model/Products");

const app = express();

async function start() {
  await connectDb(process.env.MONGO_URI);
  const product = await Products.create(products);
  app.listen(3000, () => {
    console.log("server is listening on port 3000....");
  });
}

start();
