require("dotenv").config();
const express = require("express");
const helmet = require("helmet");
const { xss } = require("express-xss-sanitizer");
const notFound = require("./middleware/notFound");
const errorHandlingMiddleWare = require("./middleware/errorHandlingMiddleware");
const connectDb = require("./db/connectdb");
const productsRouter = require("./routers/products");
const userRouter = require("./routers/user");
const orderRouter = require("./routers/orders");

const app = express();

const port = process.env.PORT || 3000;


app.use(xss());
app.use(helmet());
app.use(express.json());

app.use("/api/v1/orders", orderRouter);
app.use("/api/v1/products", productsRouter);
app.use("/api/v1/user", userRouter);

app.use(notFound);
app.use(errorHandlingMiddleWare);

async function start() {
  await connectDb(process.env.MONGO_URI);
  app.listen(port, () => {
    console.log(`Server is listening on port ${port}...`);
  });
}

start();
