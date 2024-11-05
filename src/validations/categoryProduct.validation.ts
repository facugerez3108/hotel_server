import Joi from 'joi';

const createCategoryProduct = {
    body: Joi.object().keys({
        title: Joi.string().required(),
    })
}

const getCategoriesProduct = {
    query: Joi.object().keys({
        title: Joi.string(),
        sortBy: Joi.string(),
        limit: Joi.number().integer(),
        page: Joi.number().integer(),
    })
}

const getCategoryProduct = {
    params: Joi.object().keys({
        id: Joi.number().integer()
    })
}

const updateCategoryProduct = {
    params: Joi.object().keys({
        id: Joi.number().integer()
    }),
    body: Joi.object().keys({
        title: Joi.string(),
    }).min(1)
}

const deleteCategoryProduct = {
    params: Joi.object().keys({
        categoryId: Joi.number().integer()
    })
}

export default {
    createCategoryProduct,
    getCategoriesProduct,
    getCategoryProduct,
    updateCategoryProduct,
    deleteCategoryProduct
}