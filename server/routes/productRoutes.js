import express from "express";
import {
  getProducts,
  getProductById,
  requestStockNotification,
} from "../controllers/productController.js";

const router = express.Router();

router.get("/", getProducts);
router.post("/notify-restock", requestStockNotification);
router.get("/:id", getProductById);

export default router;