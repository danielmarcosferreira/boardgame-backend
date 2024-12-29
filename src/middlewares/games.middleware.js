import { gamesSchema } from "../models/games.model.js";

export function gamesMiddleware(req, res, next) {
    const { name, image, stockTotal, categoryId, pricePerDay } = req.body;

    const newGame = { name, image, stockTotal, categoryId, pricePerDay }

    const validation = gamesSchema.validate(newGame, { abortEarly: false })

    if (validation.error) {
        const errors = validation.error.details.map(error => error.message)
        return res.status(422).send(errors)
    }

    req.message = newGame

    next()
}