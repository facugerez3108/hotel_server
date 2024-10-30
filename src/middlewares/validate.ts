import httpStatus from "http-status";
import ApiError from "../utils/ApiError";
import { NextFunction, Request, Response } from "express";
import pick from "../utils/pick";
import Joi from "joi";

const validate = (schema: object) => (req: Request, res: Response, next: NextFunction) => {
    const validateSchema = pick(schema, ["params", "query", "body"]);
    const object = pick(req, Object.keys(validateSchema));
    const { value, error } = Joi.compile(validateSchema)
        .prefs({ errors: { label: "key" }, abortEarly: false })
        .validate(object);
    if(error) {
        const errorMessage = error.details.map((details) => details.message).join(", ");
        return next(new ApiError(httpStatus.BAD_REQUEST, errorMessage));
    }

    Object.assign(req, value);
    return next();
}

export default validate;