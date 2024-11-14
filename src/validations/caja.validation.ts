import Joi from "joi";

const createCaja = {
    body: Joi.object().keys({
        mto_apertura: Joi.number().required(),
        dro_hospedamiento: Joi.number().required(),
        dro_ventas: Joi.number().required(),
        dro_cierre: Joi.number().required(),
        fecha_apertura: Joi.date().required(),
        hora_apertura: Joi.string().required(),
        fecha_cierre: Joi.date().required(),
        hora_cierre: Joi.string().required(),
        status: Joi.boolean().required(),
    })
}

const queryCajas = {
    query: Joi.object().keys({
        mto_apertura: Joi.number(),
        dro_hospedamiento: Joi.number(),
        dro_ventas: Joi.number(),
        dro_cierre: Joi.number(),
        fecha_apertura: Joi.date(),
        hora_apertura: Joi.string(),
        fecha_cierre: Joi.date(),
        hora_cierre: Joi.string(),
        status: Joi.boolean(),
        sortBy: Joi.string(),
        limit: Joi.number().integer(),
        page: Joi.number().integer(),
    })
}

const getCaja = {
    params: Joi.object().keys({
        id: Joi.string().required()
    })
}

const updateCaja = {
    params: Joi.object().keys({
        id: Joi.string().required()
    }),
    body: Joi.object().keys({
        mto_apertura: Joi.number(),
        dro_hospedamiento: Joi.number(),
        dro_ventas: Joi.number(),
        dro_cierre: Joi.number(),
        fecha_apertura: Joi.date(),
        hora_apertura: Joi.string(),
        fecha_cierre: Joi.date(),
        hora_cierre: Joi.string(),
        status: Joi.boolean(),
    })
}

export default {
    createCaja,
    queryCajas,
    getCaja,
    updateCaja,
}