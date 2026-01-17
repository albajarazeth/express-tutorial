const express = require("express");
const router = express.Router;

router.get("/", (req, res) => {
  res.json([
    { id: 1, name: "laptop" },
    { id: 1, name: "phone" },
  ]);
});

router.get("/:id", (req, res) => {
  const id = Number(req.params.id);
  const products = [
    { id: 1, name: "laptop" },
    { id: 1, name: "phone" },
  ];

  const requestedProduct = products.find((product) => product.id === id);
  res.json(requestedProduct);
});

router.get("/special", (req, res) => {
  res.json({ message: "Special products" });
});

module.exports = router;
