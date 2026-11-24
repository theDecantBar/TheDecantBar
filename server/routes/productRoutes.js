import express from "express";
import {
  getProducts,
  getProductById,
  requestStockNotification,
} from "../controllers/productController.js";
import { getCustomFragranceNotes } from "../controllers/adminController.js";

const router = express.Router();

router.get("/notes", getCustomFragranceNotes);
router.get("/", getProducts);
router.post("/notify-restock", requestStockNotification);
router.get("/:id", getProductById);

export default router;