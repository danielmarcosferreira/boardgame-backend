import { Router } from "express";
import { rentalsMiddleware } from "../middlewares/rentals.middleware.js";
import { deleteRental, getRentals, postRental, postRentalReturn } from "../controllers/rentals.controller.js";

const router = Router()

router.post("/rentals", rentalsMiddleware, postRental)
router.get("/rentals", getRentals)
router.post("/rentals/:id/return", postRentalReturn)
router.delete("/rentals/:id", deleteRental)
// router.put("/customers/:id", customersMiddleware, putCustomers)

export default router;