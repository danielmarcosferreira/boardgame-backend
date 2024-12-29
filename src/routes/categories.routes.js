import { Router } from "express";
import { getCategories, postCategories } from "../controllers/categories.controller.js";
import { categoriesMiddleware } from "../middlewares/categories.middleware.js";

const router = Router()

router.post("/categories", categoriesMiddleware, postCategories)
router.get("/categories", getCategories)

export default router;