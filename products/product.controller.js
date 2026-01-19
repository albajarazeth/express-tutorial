const productService = require("./product.service");

const getAll = async (req, res) => {
  try {
    const products = await productService.getAllProducts();
    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch products" });
  }
};

const getSpecial = (req, res) => {
  res.json({ message: "Special products" });
};

const getById = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const product = await productService.getProductById(id);

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch product" });
  }
};

const create = async (req, res) => {
  try {
    const { name, price } = req.body;
    const product = await productService.createProduct({ name, price });
    res.status(201).json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create product" });
  }
};

module.exports = {
  getAll,
  getSpecial,
  getById,
  create,
};
