import Joi from 'joi'

export const commissionInputSchema = Joi.object({
    amount: Joi.number().required(),
    currency: Joi.string().required(),
    date: Joi.string().required(),
    client_id: Joi.string().required(),
})

export const commissionResponseSchema = Joi.object().keys({
    amount: Joi.number().required(),
    currency: Joi.string().required(),
})
