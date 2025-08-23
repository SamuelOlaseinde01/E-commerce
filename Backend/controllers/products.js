const { NotFoundError } = require("../errors");
const Products = require("../model/Products");

async function getAllProducts(req, res) {
  const { search, sort, category } = req.query;

  let query = {};

  if (category) {
    query.category = category;
  }

  if (search) {
    query.title = { $regex: search, $options: "i" };
  }

  let mongoQuery = Products.find(query);

  if (sort) {
    const sortList = sort.split(",").join(" ");
    mongoQuery = mongoQuery.sort(sortList);
  }

  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const skip = (page - 1) * limit;
  mongoQuery = mongoQuery.skip(skip).limit(limit);

  const products = await mongoQuery;
  res.status(200).json({ products });
}

async function getProduct(req, res) {
  const { id } = req.params;
  const product = await Products.findById(id);
  if (!product) {
    throw new NotFoundError(`No product with id of ${id}`);
  }
  res.status(200).json({ product });
}

module.exports = {
  getAllProducts,
  getProduct,
};
