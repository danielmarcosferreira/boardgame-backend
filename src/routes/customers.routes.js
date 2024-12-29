import { Router } from "express";
import { customersMiddleware } from "../middlewares/customers.middleware.js";
import { getCustomers, postCustomers, putCustomers } from "../controllers/customers.controller.js";

const router = Router()

router.post("/customers", customersMiddleware, postCustomers)
router.get("/customers", getCustomers)
router.get("/customers/:id", getCustomers)
router.put("/customers/:id", customersMiddleware, putCustomers)

export default router;