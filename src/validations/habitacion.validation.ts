import Joi from "joi";

const createHabitacion = {
    body: Joi.object().keys({
        descripcion: Joi.string().required(),
        precio: Joi.number().required(),
        nivel: Joi.string().required(),
        disponibilidad: Joi.boolean().required(),
        categoria: Joi.string().required(),
        cliente: Joi.string().required(),
    })
}

const queryHabitaciones = {
    query: Joi.object().keys({
        descripcion: Joi.string(),
        precio: Joi.number(),
        nivel: Joi.string(),
        disponibilidad: Joi.boolean(),
        categoria: Joi.string(),
        cliente: Joi.string(),
        sortBy: Joi.string(),
        limit: Joi.number().integer(),
        page: Joi.number().integer(),
    })
}

const getHabitacion = {
    params: Joi.object().keys({
        id: Joi.string().required()
    })
} 

const updateHabitacion = {
    params: Joi.object().keys({
        id: Joi.string().required()
    }),
    body: Joi.object().keys({
        descripcion: Joi.string(),
        precio: Joi.number(),
        nivel: Joi.string(),
        disponibilidad: Joi.boolean(),
        categoria: Joi.string(),
        cliente: Joi.string(),
    })
}

const deleteHabitacion = {
    params: Joi.object().keys({
        id: Joi.string().required()
    })
}

export default {
    createHabitacion,
    queryHabitaciones,
    getHabitacion,
    updateHabitacion,
    deleteHabitacion
}