import Joi from "joi";

export const rentalSchema = Joi.object({
    customerId: Joi.number()
        .integer()
        .positive()
        .required()
        .messages({
            "number.base": "Customer ID must be a number.",
            "number.integer": "Customer ID must be an integer.",
            "number.positive": "Customer ID must be a positive number.",
            "any.required": "Customer ID is required."
        }),
    gameId: Joi.number()
        .integer()
        .positive()
        .required()
        .messages({
            "number.base": "Game ID must be a number.",
            "number.integer": "Game ID must be an integer.",
            "number.positive": "Game ID must be a positive number.",
            "any.required": "Game ID is required."
        }),
    rentDate: Joi.date()
        .iso()
        .required()
        .messages({
            "date.base": "Rent Date must be a valid date.",
            "date.format": "Rent Date must be in ISO 8601 format.",
            "any.required": "Rent Date is required."
        }),
    daysRented: Joi.number()
        .integer()
        .positive()
        .min(1)
        .required()
        .messages({
            "number.base": "Days Rented must be a number.",
            "number.integer": "Days Rented must be an integer.",
            "number.positive": "Days Rented must be a positive number.",
            "number.min": "Days Rented must be at least 1 day.",
            "any.required": "Days Rented is required."
        }),
    returnDate: Joi.date()
        .iso()
        .allow(null) // Allow null for rentals that are not yet returned
        .messages({
            "date.base": "Return Date must be a valid date.",
            "date.format": "Return Date must be in ISO 8601 format."
        }),
    originalPrice: Joi.number()
        .integer()
        .positive()
        .required()
        .messages({
            "number.base": "Original Price must be a number.",
            "number.integer": "Original Price must be an integer.",
            "number.positive": "Original Price must be a positive number.",
            "any.required": "Original Price is required."
        }),
    delayFee: Joi.number()
        .integer()
        .positive()
        .allow(null) // Allow null for rentals with no delay
        .messages({
            "number.base": "Delay Fee must be a number.",
            "number.integer": "Delay Fee must be an integer.",
            "number.positive": "Delay Fee must be a positive number."
        })
});