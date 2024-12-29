import connection from "../database/database.js"

export async function postGames(req, res) {
    const { name, image, stockTotal, categoryId, pricePerDay } = req.message;

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
        
        const nameExists = games.rows.map(game => {
            if (game.name === name) {
                return name
            }
        })

        if (nameExists) {
            console.log("There is already a game with that name")
            return res.sendStatus(409)
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

    try {
        if (name) {
            const gamesWithName = await connection.query(`SELECT * FROM games WHERE name LIKE $1;`, [`${name}%`]);
            return res.send(gamesWithName.rows);
        }

        const games = await connection.query(`SELECT * FROM games;`);

        const allGames = games.rows.map(game => {
            let categoryName;

            if (game.categoryId === 1) {
                categoryName = 'Estratégia';
            } else {
                categoryName = 'Investigação';
            } 

            return {...game, categoryName};
        })

        return res.send(allGames)
    } catch (err) {
        console.error("Error getting games:", err);
        return res.status(500).send({ message: "Error getting games" })
    }
}