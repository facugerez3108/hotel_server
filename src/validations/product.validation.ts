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

const updateProduct = {
    params: Joi.object().keys({
        id: Joi.string().required()
    }),
    body: {
        name: Joi.string(),
        description: Joi.string(),
        price: Joi.number(),
        code: Joi.string(),
        category: Joi.string(),
        stock: Joi.number(),
    }
}

const queryProducts = {
    query: Joi.object().keys({
        name: Joi.string(),
        description: Joi.string(),
        price: Joi.number(),
        code: Joi.string(),
        category: Joi.string(),
        stock: Joi.number(),
        sortBy: Joi.string(),
        limit: Joi.number().integer(),
        page: Joi.number().integer(),
    })
}

const deleteProduct = {
    params: Joi.object().keys({
        id: Joi.string().required()
    })
}

export default {
    createProduct,
    getProduct,
    updateProduct,
    queryProducts,
    deleteProduct
}