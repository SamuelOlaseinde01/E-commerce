const { NotFoundError } = require("../errors");
const jwt = require("jsonwebtoken");

async function authMiddleware(req, res, next) {
  const authHeaders = req.headers.authorization;
  if (!authHeaders || !authHeaders.startsWith("Bearer")) {
    throw new NotFoundError("Token not provided");
  }
  const token = authHeaders.split(" ")[1];
  try {
    const decoded = jwt.decode(token, process.env.JWT_SECRET);
    const { userId, email } = decoded;
    req.user = { userId, email };
    next();
  } catch (error) {
    console.error(error);
  }
}

module.exports = authMiddleware;
