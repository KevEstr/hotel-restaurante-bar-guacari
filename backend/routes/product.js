const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const {
    createProduct,
    getProducts,
    getProduct,
    updateProduct,
    deleteProduct,
    getAllIngredientsOfProduct,
    getIngredientStockForProduct,
} = require("../controllers/product");

// VALIDATORS
const { runValidation } = require("../validators");
const { productCreateValidator } = require("../validators/product");

// ROUTES
router
    .route("/")
    .post(protect, productCreateValidator, runValidation, createProduct)
    .get(protect, getProducts)
    .get(protect, getAllIngredientsOfProduct)
    .get(protect, getIngredientStockForProduct);

router
    .route("/:id")
    .get(protect, getProduct)
    .get(protect, getAllIngredientsOfProduct)
    .get(protect, getIngredientStockForProduct)
    .put(protect, updateProduct)
    .delete(protect, deleteProduct);

module.exports = router;
