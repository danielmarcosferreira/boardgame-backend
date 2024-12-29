import Joi from 'joi';

export const gamesSchema = Joi.object({
    name: Joi.string().min(3).max(30).required(),
    image: Joi.string().min(6).required(),
    stockTotal: Joi.number().required(),
    categoryId: Joi.number().required(),
    pricePerDay: Joi.number().required() 
})