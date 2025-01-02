import dayjs from "dayjs";
import { rentalSchema } from "../models/rental.model.js";
import connection from "../database/database.js";

export async function rentalsMiddleware(req, res, next) {
    const { customerId, gameId, daysRented } = req.body;

    try {
        const gameExist = await connection.query(`
            SELECT * FROM games WHERE id = $1;`, [gameId])
        if (gameExist.rowCount === 0) {
            return res.status(400).send({ message: "Game not found" });
        }

        const game = await connection.query(`
            SELECT * FROM games WHERE id = $1;`, [gameId]);

        const rental = {
            customerId,
            gameId,
            daysRented,
            rentDate: dayjs().format("YYYY-MM-DD"),
            originalPrice: daysRented * game.rows[0].pricePerDay,
            returnDate: null,
            delayFee: null
        }

        const validation = rentalSchema.validate(rental, { abortEarly: false })

        if (validation.error) {
            const errors = validation.error.details.map(error => error.message)
            return res.status(422).send(errors)
        }

        const userExist = await connection.query(`
            SELECT * FROM customers WHERE id = $1;`, [customerId])
        if (userExist.rowCount === 0) {
            return res.status(400).send({ message: "Customer not found" });
        }

        req.body = rental;

        next()
    } catch (err) {
        console.log(err)
        res.status(500).send(err.message)
    }
}