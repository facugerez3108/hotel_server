import Joi from 'joi';

const createClient = {
    body: {
        name: Joi.string().required(),
        lastname: Joi.string().required(),
        dni: Joi.number().required(),
        nro_telefono: Joi.number().required(),
        email: Joi.string().required().email(),
        razon_visita: Joi.string().required(),
    }
}

const queryClients = {
    query: Joi.object().keys({
        name: Joi.string(),
        lastname: Joi.string(),
        dni: Joi.number(),
        nro_telefono: Joi.number(),
        email: Joi.string(),
        razon_visita: Joi.string(),
        sortBy: Joi.string(),
        limit: Joi.number().integer(),
        page: Joi.number().integer(),
    })
}

const getClient = {
    params: Joi.object().keys({
        id: Joi.string().required()
    })
}

const updateClient = {
    params: Joi.object().keys({
        id: Joi.string().required()
    }),
    body: {
        name: Joi.string(),
        lastname: Joi.string(),
        dni: Joi.number(),
        nro_telefono: Joi.number(),
        email: Joi.string().email(),
        razon_visita: Joi.string(),
    }
}

const deleteClient = {
    params: Joi.object().keys({
        id: Joi.string().required()
    })
}  

export default {
    createClient,
    queryClients,
    getClient,
    updateClient,
    deleteClient
}
