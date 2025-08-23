async function getAllProducts(req, res) {
  res.send("all Products");
}

async function createProduct(req, res) {
  res.send("This Product");
}

async function getProduct(req, res) {
  res.send("This Product");
}

async function updateProduct(req, res) {
  res.send("This Product");
}

async function deleteProduct(req, res) {
  res.send("This Product");
}

module.exports = {
  getAllProducts,
  createProduct,
  getProduct,
  updateProduct,
  deleteProduct,
};
