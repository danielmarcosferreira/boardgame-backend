import connection from "../database/database.js";
import { categoriesSchema } from "../models/categories.model.js";

export async function categoriesMiddleware(req, res, next) {
    const { name } = req.body;

    const validation = categoriesSchema.validate({ name }, { abortEarly: false })

    if (validation.error) {
        const errors = validation.error.details.map(error => error.message)
        return res.status(422).send(errors)
    }

    const categoriesExist = await connection.query(`
            SELECT * FROM categories WHERE categories.name = $1;`, [name]);
    
    if (categoriesExist.rowCount) {
        return res.sendStatus(409);
    }

    req.message = name

    next()
}