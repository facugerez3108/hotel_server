import Joi from "joi";

const createProduct = {
    body: {
        name: Joi.string().required(),
        description: Joi.string().required(),
        price: Joi.number().required(),
        code: Joi.string().required(),
        category: Joi.string().required(),
        stock: Joi.number().required(),
    }
}

const getProduct = {
    params: Joi.object().keys({
        id: Joi.string().required()
    })
    
}