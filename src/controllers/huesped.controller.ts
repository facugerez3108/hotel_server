import httpStatus from "http-status";
import pick from '../utils/pick';
import ApiError from "../utils/ApiError";
import catchAsync from "../utils/catchAsync";
import { clientService } from "../services";
import { Request, Response } from "express";

const createClient = catchAsync(async (req, res) => {
    const { name, lastname, dni, razon_visita, email, nro_telefono, habitacionId } = req.body;
    const client = await clientService.createClient(name, lastname, dni, razon_visita, email, nro_telefono, habitacionId); 
    res.status(httpStatus.CREATED).send(client);
});

const getClients = catchAsync(async (req, res) => {
    const filter = pick(req.query, 
        [
            "name",
            "lastname",
            "dni",
            "razon_visita",
            "email",
            "nro_telefono",
            "habitacionId"
        ]
    );
    const options = pick(req.query, ["sortBy", "limit", "page"]);
    const result = await clientService.queryClients(filter, options);
    res.send(result);
});

const getClient = catchAsync(async (req, res) => {
    const id = parseInt(req.params.id, 10);
    const client = await clientService.getClientById(id);
    if(!client){
        throw new ApiError(httpStatus.NOT_FOUND, 'Cliente no encontrado');
    }
    res.send(client);
});

const updateClient = async (req: Request, res: Response) => {
    const { id } = req.params;
    const updateBody = req.body;

    try{
        const updateClient = await clientService.updateClientById(parseInt(id), updateBody);
        res.json(updateClient);
    }catch(err){
        console.error('Error al actualizar el cliente seleccionado', err);
    }
};

const deleteClient = catchAsync(async (req, res) => {
    const id = parseInt(req.params.id, 10);
    await clientService.deleteClient(id);
    res.status(httpStatus.NO_CONTENT).send();
});

export default {
    createClient,
    getClients,
    getClient,
    updateClient,
    deleteClient
};