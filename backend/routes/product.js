const express = require("express");
const productControllers = require("../controllers/product");
const authMiddleware = require("../middlewares/authMiddleware");
const roleMiddleware = require("../middlewares/roleMiddleware");
const router = express.Router();

router.get("/list", authMiddleware, productControllers.listProducts);

router.post(
  "/create",
  authMiddleware,
  roleMiddleware(["SELLER", "ADMIN"]),
  productControllers.createProduct
);

router.post(
  "/edit/:productId",
  authMiddleware,
  roleMiddleware(["SELLER", "ADMIN"]),
  productControllers.editProduct
);

router.delete(
  "/delete/:productId",
  authMiddleware,
  roleMiddleware(["SELLER", "ADMIN"]),
  productControllers.deleteProduct
);

module.exports = router;
