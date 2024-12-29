import { categoriesSchema } from "../models/categories.model.js";

export function categoriesMiddleware(req, res, next) {
    const { name } = req.body;

    const validation = categoriesSchema.validate({ name }, { abortEarly: false })

    if (validation.error) {
        const errors = validation.error.details.map(error => error.message)
        return res.status(422).send(errors)
    }

    req.message = name

    next()
}