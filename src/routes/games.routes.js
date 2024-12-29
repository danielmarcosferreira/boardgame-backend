import { Router } from "express";
import { gamesMiddleware } from "../middlewares/games.middleware.js";
import { getGames, postGames } from "../controllers/games.controller.js";

const router = Router()

router.post("/games", gamesMiddleware, postGames)
router.get("/games", getGames)

export default router;