import connection from "../database/database.js"

export async function postGames(req, res) {
    const { name, image, stockTotal, categoryId, pricePerDay } = req.body;

    try {
        const games = await connection.query(`SELECT * FROM games;`);

        if (stockTotal <= 0 || pricePerDay <= 0) {
            console.log("stockTotal and pricePerDay should be higher than 0")
            return res.sendStatus(400)
        }

        if (categoryId !== 1 && categoryId !== 2) {
            console.log("categoryId should be 1 or 2")
            return res.sendStatus(400)
        }

        const nameResult = await connection.query(
            `SELECT * FROM games WHERE name = $1;`, [name]
        )
        if (nameResult.rows.length > 0) {
            console.log("There is already a game with that name");
            return res.status(409).send({ message: "Game name already exists" });
        }

        await connection.query(`
            INSERT INTO games ("name", "image", "stockTotal", "categoryId", "pricePerDay") 
            VALUES ($1, $2, $3, $4, $5);`, [name, image, stockTotal, categoryId, pricePerDay]);

        return res.sendStatus(201)
    } catch (err) {
        console.error("Error posting games:", err);
        return res.status(422).send({ message: "Error posting new game" })
    }
}

export async function getGames(req, res) {
    const { name, offset, limit, order } = req.query;

    try {
        if (name) {
            const gamesWithName = await connection.query(`
                SELECT * FROM games WHERE name ILIKE $1;`, [`${name}%`]);
            return res.send(gamesWithName.rows);
        }

        let query = `SELECT * FROM games`;
        const params = [];
        const conditions = [];

        if (order) {
            const allowedFields = ["name", "categoryId", "pricePerDay"];
            if (!allowedFields.includes(order)) {
                return res.status(400).send({ message: "Invalid order field" });
            }
            conditions.push(`ORDER BY "${order}"`);
        } else {
            conditions.push(`ORDER BY "categoryId"`);
        }

        if (limit) {
            conditions.push(`LIMIT $${params.length + 1}`);
            params.push(limit);
        }
        if (offset) {
            conditions.push(`OFFSET $${params.length + 1}`);
            params.push(offset);
        }

        query += ` ${conditions.join(" ")}`;
        const result = await connection.query(`
            SELECT games.*, categories.name AS "categoryName" 
            FROM games 
            JOIN categories 
            ON games."categoryId" = categories.id;`);

        return res.send(result.rows)
    } catch (err) {
        console.error("Error getting games:", err);
        return res.status(500).send({ message: "Error getting games" })
    }
}