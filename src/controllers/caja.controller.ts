import httpStatus from "http-status";
import catchAsync from "../utils/catchAsync";
import { cajaServices } from "../services";
import pick from "../utils/pick";
import { Request, Response } from "express";
import ApiError from "../utils/ApiError";

const createCaja = catchAsync(async (req, res) => {
    const { 
        mto_apertura, 
        fecha_apertura, 
        hora_apertura, 
        fecha_cierre, 
        hora_cierre, 
        dro_hospedamiento, 
        dro_ventas, 
        dro_cierre,
        userId, 
        status
    } = req.body;
    
    const caja = await cajaServices.createCaja(
        mto_apertura,
        fecha_apertura,
        hora_apertura,
        fecha_cierre,
        hora_cierre,
        dro_hospedamiento,
        dro_ventas,
        dro_cierre,
        userId,
        status
    );
    
    res.status(httpStatus.CREATED).send(caja);
})

const queryCajas = catchAsync(async (req: Request, res: Response) => {
    const filter = pick(req.query, [
        'mto_apertura', 
        'fecha_apertura',
        'hora_apertura',
        'fecha_cierre',
        'hora_cierre',
        'dro_hospedamiento',
        'dro_ventas',
        'dro_cierre',
        'status'
    ]);
    const options = pick(req.query, ['sortBy', 'sortType', 'limit', 'page']);
    const result = await cajaServices.queryCaja(filter, options);
    res.send(result);
});

const updateCaja = catchAsync(async (req: Request, res: Response) => {
    const cajaId = parseInt(req.params['cajaId']);
    const updateBody = req.body;
    const caja = await cajaServices.updateCaja(cajaId, updateBody);
    res.send(caja);
});

const cerrarCaja = catchAsync(async (req: Request, res: Response) => {
    const cajaId = parseInt(req.params['cajaId']);
    const caja = await cajaServices.closeCaja(cajaId);
    res.send(caja);
});

export default {
    createCaja,
    queryCajas,
    updateCaja,
    cerrarCaja
}