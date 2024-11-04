import httpStatus from "http-status";
import ApiError from "../utils/ApiError";
import { Caja, CajaStatus, Prisma } from '@prisma/client';
import prisma from "../client";


const createCaja = async (
    userId: number,
    mto_apertura: number,
    dro_cierre: number,
    dro_hospedamiento: number,
    dro_ventas: number,
    fecha_apertura: Date,
    hora_apertura: Date,
    fecha_cierre: Date,
    hora_cierre: Date,
    status: CajaStatus
): Promise<Caja> => {
    const caja = await prisma.caja.create({
        data: {
            mto_apertura,
            userId,
            dro_hospedamiento,
            dro_ventas,
            dro_cierre,
            fecha_apertura,
            hora_apertura,
            fecha_cierre,
            hora_cierre,
            status
        },
    });
    return caja;
};

const queryCaja = async <Key extends keyof Caja>(
    filter: object = {},
    options: {
        limit?: number;
        page?: number;
        sortBy?: string;
        sortType?: 'asc' | 'desc';
    },
    keys: Key[] = [
        'id',
        'mto_apertura',
        'userId',
        'dro_hospedamiento',
        'dro_ventas',
        'dro_cierre',
        'fecha_apertura',
        'hora_apertura',
        'fecha_cierre',
        'hora_cierre'
    ] as Key[]
): Promise<Pick<Caja, Key>[]> => {
    const page = options.page ?? 1;
    const limit = options.limit ?? 10;
    const sortBy = options.sortBy;
    const sortType = options.sortType ?? 'desc';
    const caja = await prisma.caja.findMany({
        where: filter,
        select: keys.reduce((obj, k) => ({ ...obj, [k]: true }), {}),
        skip: (page - 1) * limit,
        take: limit,
        orderBy: sortBy ? { [sortBy]: sortType } : undefined,
    });

    return caja as Pick<Caja, Key>[];
}

const getCajaById = async <Key extends keyof Caja>(
    id: number,
    keys: Key[] = [
        'id',
        'mto_apertura',
        'userId',
        'dro_hospedamiento',
        'dro_ventas',
        'dro_cierre',
        'fecha_apertura',
        'hora_apertura',
        'fecha_cierre',
        'hora_cierre'
    ] as Key[]
): Promise<Pick<Caja, Key> | null> => {
    const caja = await prisma.caja.findUnique({
        where: { id },
        select: keys.reduce((obj, k) => ({ ...obj, [k]: true }), {}),
    });
    return caja as Pick<Caja, Key> | null;
}

const updateCaja = async <Key extends keyof Caja>(
    cajaId: number,
    updateBody: Prisma.CajaUpdateInput,
    keys: Key[] = [
        'id',
        'mto_apertura',
        'userId',
        'dro_hospedamiento',
        'dro_ventas',
        'dro_cierre',
        'fecha_apertura',
        'hora_apertura',
        'fecha_cierre',
        'hora_cierre'
    ] as Key[]
): Promise<Pick<Caja, Key> | null> => {
    const caja = await getCajaById(cajaId, ['id', 'status']);
    if(!caja){
        throw new ApiError(httpStatus.NOT_FOUND, 'Caja not found');
    }

    if(caja.status === 'CERRADA'){
        throw new ApiError(httpStatus.BAD_REQUEST, 'Caja is closed');
    }

    const updateCaja = await prisma.caja.update({
        where: { id: caja.id },
        data: updateBody,
        select: keys.reduce((obj, k) => ({ ...obj, [k]: true }), {}),
    });
    return updateCaja as Pick<Caja, Key> | null;
}

const closeCaja = async (cajaId: number): Promise<Caja> => {
    const caja = await getCajaById(cajaId, ['id', 'status']);
    if(!caja){
        throw new ApiError(httpStatus.NOT_FOUND, 'Caja not found');
    }
    const updateCaja = await prisma.caja.update({
        where: { id: caja.id },
        data: {
            status: 'CERRADA',
            fecha_cierre: new Date(),
            hora_cierre: new Date(),
        },
    });
    return updateCaja;
}

export default {
    createCaja,
    queryCaja,
    getCajaById,
    updateCaja,
    closeCaja
}
