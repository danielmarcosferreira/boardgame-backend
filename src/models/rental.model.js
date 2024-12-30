import Joi from "joi";

export const rentalSchema = Joi.object({
    customerId: Joi.number()
        .integer()
        .positive()
        .required()
        .messages({
            "number.base": "Customer ID must be a number",
            "number.integer": "Customer ID must be an integer",
            "number.positive": "Customer ID must be a positive number",
            "any.required": "Customer ID is required"
        }),
    gameId: Joi.number()
        .integer()
        .positive()
        .required()
        .messages({
            "number.base": "Game ID must be a number",
            "number.integer": "Game ID must be an integer",
            "number.positive": "Game ID must be a positive number",
            "any.required": "Game ID is required"
        }),
    daysRented: Joi.number()
        .integer()
        .positive()
        .min(1)
        .required()
        .messages({
            "number.base": "Days Rented must be a number",
            "number.integer": "Days Rented must be an integer",
            "number.positive": "Days Rented must be a positive number",
            "number.min": "Days Rented must be at least 1 day",
            "any.required": "Days Rented is required"
        }),
});