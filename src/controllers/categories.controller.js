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
    try {
        const allCategories = await connection.query(`SELECT * FROM categories;`);
        return res.send(allCategories.rows)
    } catch (err) {
        console.log("Error adding new Categorie")
        return res.status(422).send({ message: "Error posting new categorie" })
    }
}