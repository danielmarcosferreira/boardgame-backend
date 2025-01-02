import connection from "../database/database.js"
import dayjs from "dayjs"

export async function postRental(req, res) {
    const { customerId,
        gameId,
        daysRented,
        rentDate,
        originalPrice,
        returnDate,
        delayFee } = req.body;

        const rental = req.body;
    console.log(rental)

    try {
        await connection.query(`
            INSERT INTO rentals ("customerId", "gameId", "rentDate", "daysRented", "returnDate", "originalPrice", "delayFee") 
            VALUES ($1, $2, $3, $4, $5, $6, $7);`,
            [customerId, gameId, rentDate, daysRented, returnDate, originalPrice, delayFee]);

        return res.sendStatus(201)
    } catch (err) {
        console.error("Error posting games:", err);
        return res.status(422).send({ message: "Error posting new customer" });
    }
}

export async function getRentals(req, res) {
    const { gameId, customerId, offset, limit, order } = req.query;

    try {
        if (gameId) {
            const gameExists = await connection.query(`SELECT * FROM games WHERE id = $1;`, [gameId]);
            if (gameExists.rowCount === 0) {
                console.log(`Game with ID ${gameId} does not exist`);
                return res.status(404).send({ message: `Game with ID ${gameId} not found` });
            }
        }

        if (customerId) {
            const customerExists = await connection.query(`SELECT * FROM customers WHERE id = $1;`, [customerId]);
            if (customerExists.rowCount === 0) {
                console.log(`Customer with ID ${customerId} does not exist`);
                return res.status(404).send({ message: `Customer with ID ${customerId} not found` });
            }
        }

        let query = `
            SELECT 
                rentals.*, 
                customers.id AS "customerId", 
                customers.name AS "customerName", 
                games.id AS "gameId", 
                games.name AS "gameName", 
                games."categoryId"
            FROM rentals 
            JOIN customers ON rentals."customerId" = customers.id 
            JOIN games ON rentals."gameId" = games.id`;

        const params = [];
        const conditions = [];

        if (gameId) {
            conditions.push(`rentals."gameId" = $${params.length + 1}`);
            params.push(gameId);
        }

        if (customerId) {
            conditions.push(`rentals."customerId" = $${params.length + 1}`);
            params.push(customerId);
        }

        if (conditions.length > 0) {
            query += ` WHERE ${conditions.join(" AND ")}`;
        }

        if (order) {
            const allowedFields = ["rentDate", "daysRented", "originalPrice"];
            if (!allowedFields.includes(order)) {
                return res.status(400).send({ message: "Invalid order field" });
            }
            query += ` ORDER BY "${order}"`;
        } else {
            query += ` ORDER BY "rentDate"`
        }

        if (limit) {
            query += ` LIMIT $${params.length + 1}`;
            params.push(limit);
        }

        if (offset) {
            query += ` OFFSET $${params.length + 1}`;
            params.push(offset);
        }

        const rentals = await connection.query(query, params);

        const formattedRentals = rentals.rows.map((rental) => ({
            id: rental.id,
            customerId: rental.customerId,
            gameId: rental.gameId,
            rentDate: rental.rentDate.toISOString().split("T")[0], // Format to YYYY-MM-DD
            daysRented: rental.daysRented,
            returnDate: rental.returnDate ? rental.returnDate.toISOString().split("T")[0] : null,
            originalPrice: rental.originalPrice,
            delayFee: rental.delayFee,
            customer: {
                id: rental.customerId,
                name: rental.customerName,
            },
            game: {
                id: rental.gameId,
                name: rental.gameName,
                categoryId: rental.categoryId,
            },
        }));

        return res.send(formattedRentals);
    } catch (err) {
        console.error("Error getting rentals:", err);
        return res.status(500).send({ message: "Error getting rentals" });
    }
}


export async function postRentalReturn(req, res) {
    const { id } = req.params;

    try {
        const rental = await connection.query(`SELECT * FROM rentals WHERE id = $1;`, [id]);

        if (rental.rowCount === 0) {
            console.log(`Rental with ID ${id} not found`);
            return res.status(404).send({ message: `Rental with ID ${id} not found` });
        }

        const { rentDate, daysRented, returnDate } = rental.rows[0];

        if (returnDate) {
            console.log(`Rental with ID ${id} has already been returned`);
            return res.status(400).send({ message: `Rental with ID ${id} has already been returned` });
        }

        const dueDate = dayjs(rentDate).add(daysRented, "day");
        const today = dayjs();

        if (today.isAfter(dueDate)) {
            const overdueDays = today.diff(dueDate, "day");
            const delayFee = overdueDays * gamePricePerDay; // Add game price per day from your DB
            console.log(`Delay Fee: ${delayFee}`);
            await connection.query(`UPDATE rentals SET "delayFee" = $1 WHERE id = $2;`, [delayFee, id])
            return res.send(delayFee)
        } else {
            console.log(`Rental with ID ${id} is returned on time`);
        }

        const updateReturnDate = today.format("YYYY-MM-DD");
        await connection.query(
            `UPDATE rentals SET "returnDate" = $1 WHERE id = $2;`,
            [updateReturnDate, id]
        );
        console.log(`Rental with ID ${id} successfully returned`);
        return res.sendStatus(200);

    } catch (err) {
        console.error("Error updating rental:", err);
        return res.status(500).send({ message: "Error updating rental" });
    }
}

export async function deleteRental(req, res) {
    const { id } = req.params;

    const deleteGame = await connection.query(`
        SELECT * FROM rentals WHERE id = $1;`, [id])

    if (deleteGame.rowCount === 0) {
        return res.sendStatus(404)
    }

    if (deleteGame.rows[0].returnDate === null) {
        return res.sendStatus(400)
    } else {
        await connection.query(`
        DELETE FROM rentals WHERE id = $1;`, [id]);
        console.log(`Rental with id ${id} succefully deleted`)
        return res.sendStatus(200)
    }
}