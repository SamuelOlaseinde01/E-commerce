const { NotFoundError } = require("../errors");
const Cart = require("../model/Cart");
const Order = require("../model/Order");
const Products = require("../model/Products");

async function getCart(req, res) {
  const { userId } = req.user;
  const cart = await Cart.findOne({ user: userId }).populate(
    "items.product",
    "-description"
  );
  res.status(200).json({ cart });
}

async function addToCart(req, res) {
  const { userId } = req.user;
  let cart = await Cart.findOne({ user: userId });
  if (!cart) {
    cart = await Cart.create({ user: userId, items: [] });
  }

  const existingItemIndex = cart.items.findIndex(
    (item) => item.product.toString() === req.body.product
  );
  if (existingItemIndex > -1) {
    cart.items[existingItemIndex].quantity = req.body.quantity;
  } else {
    cart.items.push({
      product: req.body.product,
      quantity: req.body.quantity || 1,
    });
  }

  await cart.save();
  res.status(200).json({ cart });
}

async function removeFromCart(req, res) {
  const { userId } = req.user;
  const { id: productId } = req.params;
  const cart = await Cart.findOne({ user: userId });
  if (!cart) {
    throw new NotFoundError("Cart not found");
  }

  const doesProductExist = cart.items.some(
    (product) => product.product.toString() === productId
  );

  if (!doesProductExist) {
    throw new NotFoundError("Product not found");
  }

  cart.items = cart.items.filter(
    (item) => item.product.toString() !== productId
  );
  await cart.save();

  res.status(200).json({ msg: "Item removed from cart", cart });
}

async function checkout(req, res) {
  if (!req.profileComplete) {
    return res.status(403).json({
      isProfileComplete: req.profileComplete,
      msg: "Complete your profile before proceeding to checkout",
    });
  }

  const { userId } = req.user;
  const cart = await Cart.findOne({ user: userId }).populate(
    "items.product",
    "-description"
  );

  if (!cart || cart.items.length === 0) {
    throw new NotFoundError("Cart is empty");
  }

  const total = cart.items.reduce(
    (sum, i) => sum + i.quantity * i.product.price,
    0
  );

  const orderItems = cart.items.map((item) => ({
    product: item.product._id,
    quantity: item.quantity,
  }));

  const checkout = await Order.create({
    items: orderItems,
    shippingAddress: req.body.shippingAddress,
    user: userId,
    total,
  });

  cart.items = [];
  await cart.save();

  res.status(200).json({ checkout, msg: "Checkout successful" });
}

async function singleProductCheckout(req, res) {
  if (!req.profileComplete) {
    return res.status(403).json({
      isProfileComplete: req.profileComplete,
      msg: "Complete your profile before proceeding to checkout",
    });
  }
  const { userId } = req.user;
  const { id: productId } = req.params;
  const { quantity, shippingAddress } = req.body;
  const product = await Products.findOne({ _id: productId }).select(
    "_id price"
  );
  if (!product) {
    throw new NotFoundError(`No product with id of ${productId}`);
  }

  const total = product.price * quantity;

  const checkout = await Order.create({
    items: [
      {
        product: product._id,
        quantity: quantity,
      },
    ],
    shippingAddress: shippingAddress,
    user: userId,
    total,
  });
  if (checkout) {
    const cart = await Cart.findOne({ user: userId });
    if (cart) {
      cart.items = cart.items.filter(
        (item) => item.product.toString() !== productId
      );
      await cart.save();
    }
  }
  res.status(200).json({ checkout, msg: "Order successful" });
}

module.exports = {
  getCart,
  addToCart,
  removeFromCart,
  checkout,
  singleProductCheckout,
};
