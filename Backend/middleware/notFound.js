const { StatusCodes } = require("http-status-codes");

async function notFound(req, res) {
  res.status(StatusCodes.NOT_FOUND).json({ msg: "Route not found" });
}

module.exports = notFound;
