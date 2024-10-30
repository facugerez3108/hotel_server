import { password } from "./custom.validation";
import Joi from "joi";
import { Role } from "@prisma/client";

const createUser = {
    body: Joi.object().keys({
        email: Joi.string().required().email(),
        password: Joi.string().required().custom(password),
        name: Joi.string().required(),
        role: Joi.string().valid(Role.ADMIN, Role.USER),
    }),
}


const getUsers = {
    query: Joi.object().keys({
        name: Joi.string(),
        role: Joi.string().valid(Role.ADMIN, Role.USER),
        sortBy: Joi.string(),
        limit: Joi.number().integer(),
        page: Joi.number().integer(),
    }),
}


const getUser = {
    params: Joi.object().keys({
      id: Joi.number().integer()
    })
};


const updateUser = {
    params: Joi.object().keys({
      id: Joi.number().integer()
    }),
    body: Joi.object()
      .keys({
        email: Joi.string().email(),
        role: Joi.string().valid(Role.ADMIN, Role.USER),
        name: Joi.string()
      })
      .min(1)
};
  
  const deleteUser = {
    params: Joi.object().keys({
      id: Joi.number().integer()
    })
};
  
  export default {
    createUser,
    getUsers,
    getUser,
    updateUser,
    deleteUser
};