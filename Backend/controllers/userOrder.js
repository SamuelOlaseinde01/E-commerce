const { BadRequestError, NotFoundError } = require("../errors");
const Order = require("../model/Order");

async function allOrders(req, res) {
  const { userId } = req.user;
  const orders = await Order.find({ user: userId });
  let total = orders.reduce((sum, order) => sum + order.total, 0);
  total = Math.round(total * 100) / 100;
  res.status(200).json({ total, orders });
}

async function deleteOrder(req, res) {
  const { id: orderId } = req.params;
  const { userId } = req.user;

  const order = await Order.findOne({ _id: orderId, user: userId });

  if (!order) {
    throw new NotFoundError("Order not found");
  }

  const blockedStatuses = ["paid", "shipped", "delivered", "cancelled"];
  if (blockedStatuses.includes(order.status)) {
    throw new BadRequestError(
      "You can't delete this order as it is no longer pending"
    );
  }

  await order.deleteOne();
  res.status(200).json({ msg: "Order deleted successfully" });
}

module.exports = {
  allOrders,
  deleteOrder,
};
