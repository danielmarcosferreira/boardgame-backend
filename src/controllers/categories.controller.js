import connection from "../database/database.js"

export async function postCategories(req, res) {
    const newCategorie = req.message;

    try {
        await connection.query(`INSERT INTO categories ("name") VALUES ($1);`, [newCategorie]);
        return res.sendStatus(201)
    } catch (err) {
        console.log("Error adding new Categorie")
        return res.status(422).send({ message: "Error posting new categorie" })
    }
}

export async function getCategories(req, res) {
    const { offset, limit, order } = req.query;

    try {
        let query = `SELECT * FROM categories`;
        const params = [];
        const conditions = [];

        if (order) {
            const allowedFields = ["name", "id"];
            if (!allowedFields.includes(order)) {
                return res.status(400).send({ message: "Invalid order field" });
            }
            conditions.push(`ORDER BY "${order}"`);
        } else {
            conditions.push(`ORDER BY "name"`);
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
        const result = await connection.query(query, params);

        return res.send(result.rows);
    } catch (err) {
        console.error("Error fetching categories:", err);
        return res.status(500).send({ message: "Error fetching categories" });
    }
}