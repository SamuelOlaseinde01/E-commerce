const express = require("express");

const { allOrders, deleteOrder } = require("../controllers/userOrder");
const authMiddleware = require("../middleware/authMiddleware");
const {
  getCart,
  addToCart,
  removeFromCart,
  checkout,
  singleProductCheckout,
} = require("../controllers/cart");
const userInfoCheck = require("../middleware/userInfoCheck");

const router = express.Router();

router.route("/").get(authMiddleware, allOrders);
router.route("/:id").delete(authMiddleware, deleteOrder);
router
  .route("/add-to-cart")
  .get(authMiddleware, getCart)
  .post(authMiddleware, addToCart);
router.route("/add-to-cart/:id").get(authMiddleware, removeFromCart);
router.route("/checkout").post(authMiddleware, userInfoCheck, checkout);
router
  .route("/checkout/:id")
  .post(authMiddleware, userInfoCheck, singleProductCheckout);

module.exports = router;
