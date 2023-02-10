import { Router } from "express";
import { getProducts } from "../controllers/products.controller.js";

const router = Router();

router.get("/products/:search", getProducts);

export default router;
