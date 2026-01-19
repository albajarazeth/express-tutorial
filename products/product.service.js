const prisma = require("../db/prisma");

const getAllProducts = async () => {
  return await prisma.product.findMany();
};

const getProductById = async (id) => {
  return await prisma.product.findUnique({
    where: { id },
  });
};

const createProduct = async (data) => {
  return await prisma.product.create({
    data,
  });
};

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
};
