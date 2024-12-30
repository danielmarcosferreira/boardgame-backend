import { rentalSchema } from "../models/rental.model.js";

export function rentalsMiddleware(req, res, next) {
    const { customerId, gameId, daysRented } = req.body;

    const newRental = { customerId, gameId, daysRented }

    const validation = rentalSchema.validate(newRental, { abortEarly: false })

    if (validation.error) {
        const errors = validation.error.details.map(error => error.message)
        return res.status(422).send(errors)
    }

    req.body = newRental;

    next()
}