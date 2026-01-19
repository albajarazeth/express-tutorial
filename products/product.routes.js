const express = require("express");
const router = express.Router();
const productController = require("./product.controller");

router.get("/", productController.getAll);
router.get("/special", productController.getSpecial);
router.get("/:id", productController.getById);
router.post("/", productController.create);

module.exports = router;
