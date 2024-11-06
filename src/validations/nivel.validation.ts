import Joi from 'joi';

const createNivel = {
    body: Joi.object().keys({
        title: Joi.string().required(),
    })
}

const queryNiveles = {
    query: Joi.object().keys({
        title: Joi.string(),
        sortBy: Joi.string(),
        limit: Joi.number().integer(),
        page: Joi.number().integer(),
    })
}

const getNivel = {
    params: Joi.object().keys({
        id: Joi.string().required()
    })
}

const updateNivel = {
    params: Joi.object().keys({
        id: Joi.string().required()
    }),
    body: Joi.object().keys({
        title: Joi.string(),
    })
}

const deleteNivel = {
    params: Joi.object().keys({
        id: Joi.string().required()
    })
}

export default {
    createNivel,
    queryNiveles,
    getNivel,
    updateNivel,
    deleteNivel
}