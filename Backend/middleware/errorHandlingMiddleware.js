const { StatusCodes } = require("http-status-codes");

async function errorHandlingMiddleWare(err, req, res, next) {
  let customError = {
    msg: err.message || "Something went wrong, please try again later",
    statusCode: err.statusCode || 500,
    field: err.field || null,
  };
  if (err.name == "ValidationError") {
    customError.field = Object.keys(err.errors)[0];
    customError.msg = err.errors[customError.field].message;
    customError.statusCode = StatusCodes.BAD_REQUEST;
  }
  if (err.code == 11000) {
    customError.field = Object.keys(err.keyValue)[0];
    customError.msg = "Email already exists";
    customError.statusCode = StatusCodes.UNAUTHORIZED;
  }
  res.status(customError.statusCode).json(customError);
}

module.exports = errorHandlingMiddleWare;
