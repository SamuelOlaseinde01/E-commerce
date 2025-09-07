require("dotenv").config();
const express = require("express");
const helmet = require("helmet");
const { xss } = require("express-xss-sanitizer");
const cors = require("cors");
const notFound = require("./middleware/notFound");
const errorHandlingMiddleWare = require("./middleware/errorHandlingMiddleware");
const connectDb = require("./db/connectdb");
const productsRouter = require("./routers/products");
const userRouter = require("./routers/user");
const orderRouter = require("./routers/orders");
const googleAuthRouter = require("./routers/googleAuth");
const passport = require("passport");
const configurePassport = require("./config/passport");

const app = express();

const port = process.env.PORT || 3000;

configurePassport(passport);

app.use(cors());
app.use(xss());
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/auth", googleAuthRouter);
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
