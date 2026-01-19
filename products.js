const express = require("express");
const router = express.Router();
const prisma = require("./db/prisma");

router.get("/", async (req, res) => {
  try {
    const products = await prisma.product.findMany();
    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch products" });
  }
});

router.get("/special", (req, res) => {
  res.json({ message: "Special products" });
});

router.get("/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    const product = await prisma.product.findUnique({
      where: { id },
    });
    
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }
    
    res.json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch product" });
  }
});

router.post("/", async (req, res) => {
  try {
    const { name, price } = req.body;

    const product = await prisma.product.create({
      data: {
        name,
        price,
      },
    });

    res.status(201).json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create product" });
  }
});

module.exports = router;
