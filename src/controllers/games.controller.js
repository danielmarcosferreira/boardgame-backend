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
    const { name } = req.query
    const { offset, limit } = req.query;

    try {
        if (name) {
            const gamesWithName = await connection.query(`SELECT * FROM games WHERE name LIKE $1;`, [`${name}%`]);
            return res.send(gamesWithName.rows);
        }

        if (offset && limit) {
            const result = await connection.query(`
            SELECT * FROM games ORDER BY "categoryId" LIMIT $1 OFFSET $2;`, [limit, offset]);
            return res.send(result.rows);
        } else if (offset) {
            const result = await connection.query(`
            SELECT * FROM games ORDER BY "categoryId" OFFSET $1;`, [offset]);
            return res.send(result.rows);
        } else if (limit) {
            const result = await connection.query(`
            SELECT * FROM games ORDER BY "categoryId" LIMIT $1;`, [limit]);
            return res.send(result.rows);
        }

        const games = await connection.query(`SELECT * FROM games;`);

        const allGames = games.rows.map(game => {
            let categoryName;

            if (game.categoryId === 1) {
                categoryName = 'Estratégia';
            } else if (game.categoryId === 2){
                categoryName = 'Investigação';
            } else {
                categoryName = 'Other';
            }

            return {...game, categoryName};
        })

        return res.send(allGames)
    } catch (err) {
        console.error("Error getting games:", err);
        return res.status(500).send({ message: "Error getting games" })
    }
}