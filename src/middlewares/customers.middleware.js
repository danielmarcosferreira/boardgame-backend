import { customersSchema } from "../models/customer.model.js";

export function customersMiddleware(req, res, next) {
    const { name, phone, cpf, birthday } = req.body;

    const newCustomer = { name, phone, cpf, birthday }

    const validation = customersSchema.validate(newCustomer, { abortEarly: false })

    if (validation.error) {
        const errors = validation.error.details.map(error => error.message)
        return res.status(422).send(errors)
    }

    req.body = newCustomer;

    next()
}