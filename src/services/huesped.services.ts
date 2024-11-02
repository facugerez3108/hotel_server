import httpStatus from "http-status";
import ApiError from "utils/ApiError";
import { Cliente, Prisma } from '@prisma/client';
import prisma from "../client";

const createClient = async (
    name: string,
    lastname: string,
    dni: number,
    razon_visita: string,
    nro_telefono: string,
    email: string,
    habitacionId: number
): Promise<Cliente> => {
    if (await getClientByEmail(email)){
        throw new ApiError(httpStatus.BAD_REQUEST, 'El cliente ya existe');
    };
    return prisma.cliente.create({
        data: {
            name,
            lastname,
            dni,
            razon_visita,
            nro_telefono,
            email,
            habitacionId
        }
    });
};

const getClientByEmail = async <Key extends keyof Cliente>(
    email: string,
    keys: Key[] = [
        'id',
        'name',
        'lastname',
        'dni',
        'razon_visita',
        'nro_telefono',
        'email',
        'habitacionId',
        'createdAt',
        'updatedAt'
    ] as Key[]
): Promise<Pick<Cliente, Key> | null> => {
    return prisma.cliente.findUnique({
        where: {email},
        select: keys.reduce((obj, k) => ({...obj, [k]: true}), {})
    }) as Promise<Pick<Cliente, Key> | null>;
};

const getClientById = async <Key extends keyof Cliente>(
    id: number,
    keys: Key[] = [
        'id',
        'name',
        'lastname',
        'dni',
        'razon_visita',
        'nro_telefono',
        'email',
        'habitacionId',
        'createdAt',
        'updatedAt'
    ] as Key[]
): Promise<Pick<Cliente, Key> | null> => {
    return prisma.cliente.findUnique({
        where: {id: id},
        select: keys.reduce((obj, k) => ({...obj, [k]: true}), {})
    }) as Promise<Pick<Cliente, Key> | null>;
};

const queryClients = async <Key extends keyof Cliente>(
    filter: object = {},
    options: {
        limit?: number;
        page?: number;
        sortBy?: string;
        sortType?: string;
    },
    keys: Key[] = [
        'id',
        'habitacionId',
        'name',
        'lastname',
        'dni',
        'razon_visita',
        'nro_telefono',
        'email',
        'createdAt',
        'updatedAt'
    ] as Key[]
): Promise<any[]> => {
    const sortBy = options.sortBy;
    const sortType = options.sortType ?? 'desc';
    const limit = options.limit ?? 10;
    const page = options.page ?? 1;

    const cliente = await prisma.cliente.findMany({
        where: Object.keys(filter).length ? filter : {},
        orderBy: sortBy ? { [sortBy]: sortType} : undefined,
        skip: (page - 1) * limit,
        take: limit,
        select: {
            id: true,
            name: true,
            lastname: true,
            dni: true,
            razon_visita: true,
            nro_telefono: true,
            email: true,
            habitacion: {
                select: {
                    description: true,
                    disponibilidad: true,
                    precio: true,
                    category: {
                        select: {
                            title: true
                        }
                    },
                    nivel: {
                        select: {
                            title: true
                        }
                    }
                }
            },
            createdAt: true,
            updatedAt: true
        }
    });
    
    return cliente;
}

const updateClientById = async <Key extends keyof Cliente>(
    id: number,
    updateBody: Prisma.ClienteUpdateInput,
    keys: Key[] = [
        'id',
        'name',
        'lastname',
        'dni',
        'razon_visita',
        'nro_telefono',
        'email',
        'habitacionId',
        'createdAt',
        'updatedAt'
    ] as Key[]
): Promise<Pick<Cliente, Key> | null> => {
    const cliente = await getClientById(id, [
        'id',
        'name',
        'lastname',
        'dni',
        'razon_visita',
        'nro_telefono',
        'email',
        'habitacionId',
        'createdAt',
        'updatedAt'
    ]);
    
    if (!cliente) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Cliente no encontrado');
    }

    if(updateBody.email && (await getClientByEmail(updateBody.email as string))){
        throw new ApiError(httpStatus.BAD_REQUEST, 'El email ya existe');
    }

    const updateCliente = await prisma.cliente.update({
        data: updateBody,
        where: {
            id: cliente.id
        },
        select: keys.reduce((obj, k) => ({...obj, [k]: true}), {})
    });
    return updateCliente as Pick<Cliente, Key> | null;
};

const deleteClient = async (id: number): Promise<Cliente> => {
    const cliente = await getClientById(id);
    if (!cliente) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Cliente no encontrado');
    }
    await prisma.cliente.delete({where: {id}});
    return cliente;
};

export default {
    createClient,
    getClientByEmail,
    getClientById,
    queryClients,
    updateClientById,
    deleteClient
};
