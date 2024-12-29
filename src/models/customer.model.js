import Joi from 'joi';

export const customersSchema = Joi.object({
    name: Joi.string().min(3).max(30).required(),
    phone: Joi.string()
        .pattern(/^\d{10,11}$/) // Allow only digits with 10-11 length
        .required()
        .messages({
            'string.pattern.base': 'Phone must contain 10 or 11 digits',
        }),
    cpf: Joi.string()
        .pattern(/^\d{11}$/) // Allow only digits with exactly 11 length
        .required()
        .messages({
            'string.pattern.base': 'CPF must contain exactly 11 digits',
        }),
    birthday: Joi.string()
        .pattern(/^\d{4}-\d{2}-\d{2}$/) // Match YYYY-MM-DD format
        .required()
        .messages({
            'string.pattern.base': 'Birthday must be in the format YYYY-MM-DD',
        }),
});