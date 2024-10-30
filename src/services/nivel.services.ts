import httpStatus from "http-status";
import ApiError from "utils/ApiError";
import { Nivel, Prisma } from '@prisma/client';
import prisma from "../client";
import { filter } from "compression";
import { number, object } from "joi";

const createNivel = async (
    title: string,
): Promise<Nivel> => {
    if (await getNivelByTitle(title)) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Nivel already exists')
    }

    return prisma.nivel.create({
        data: {
            title,
        }
    })
}

const getNivelByTitle = async <Key extends keyof Nivel>(
    title: string,
    keys: Key[] = ['id', 'title', 'createdAt', 'updatedAt'] as Key[]
): Promise<Pick<Nivel, Key> | null> => {
    return prisma.nivel.findUnique({
        where: { title },
        select: keys.reduce((obj, k) => ({ ...obj, [k]: true }), {})
    }) as Promise<Pick<Nivel, Key> | null>;
}

const getNivelById = async <Key extends keyof Nivel>(
    id: number,
    keys: Key[] = ['id', 'title', 'createdAt', 'updatedAt'] as Key[]
): Promise<Pick<Nivel, Key> | null> => {
    return prisma.nivel.findUnique({
        where: { id },
        select: keys.reduce((obj, k) => ({ ...obj, [k]: true }), {})
    }) as Promise<Pick<Nivel, Key> | null>;
}

const queryNiveles = async <Key extends keyof Nivel>(
    filter: object = {},
    options: {
        limit?: number;
        page?: number;
        sortBy?: string;
        sortType?: 'asc | desc';
    },
    keys: Key[] = [
        'id',
        'title',
        'createdAt',
        'updatedAt',
    ] as Key[]
): Promise<Pick<Nivel, Key>[]> => {
    const page = options.page ?? 1;
    const limit = options.limit ?? 10;
    const sortBy = options.sortBy;
    const sortType = options.sortType ?? 'desc';

    const niveles = await prisma.nivel.findMany({
        where: Object.keys(filter).length ? filter : {},
        select: keys.reduce((obj, k) => ({ ...obj, [k]: true }), {}),
        skip: (page - 1) * limit,
        take: limit,
        orderBy: sortBy ? { [sortBy]: sortType } : undefined
    });

    return niveles as Pick<Nivel, Key>[];
}

const updateNiveles = async <Key extends keyof Nivel>( 
    id: number,
    updateBody: Prisma.NivelUpdateInput,
    keys: Key[] = ['title'] as Key[]
): Promise<Pick<Nivel, Key> | null> => {
    const nivel = await getNivelById(id, ['id', 'title']);
    if (!nivel) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Nivel not found');
    }

    const updateNivel = await prisma.nivel.update({
        where: { id: nivel.id },
        data: updateBody,
        select: keys.reduce((obj, k) => ({ ...obj, [k]: true }), {})
    })

    return updateNivel as Pick<Nivel, Key> | null;
}

const deleteNivel = async (
    id: number
): Promise<Nivel> => {
    const nivel = await getNivelById(id);
    if (!nivel) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Nivel not found');
    }

    return prisma.nivel.delete({
        where: { id }
    })
}

export default {
    createNivel,
    getNivelById,
    getNivelByTitle,
    queryNiveles,
    updateNiveles,
    deleteNivel
}