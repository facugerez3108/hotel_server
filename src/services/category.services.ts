import httpStatus from "http-status";
import ApiError from "utils/ApiError";
import { Category, Prisma } from "@prisma/client";
import prisma from "../client";

const createCategory = async (
    title: string,
): Promise<Category> => {
    if(await getCategoryByTitle(title)){
        throw new ApiError(httpStatus.BAD_REQUEST, 'Category already exists')
    }

    return prisma.category.create({
        data: {
            title,
        }
    })
}

const getCategoryByTitle = async <Key extends keyof Category>(
    title: string,
    keys: Key[] = ['id', 'title', 'createdAt', 'updatedAt'] as Key[]
): Promise<Pick<Category, Key> | null> => {
    return prisma.category.findUnique({
        where: { title },
        select: keys.reduce((obj, k) => ({ ...obj, [k]: true }), {})
    }) as Promise<Pick<Category, Key> | null>;
}

const getCategoryById = async <Key extends keyof Category>(
    id: number,
    keys: Key[] = ['id', 'title', 'createdAt', 'updatedAt'] as Key[]
): Promise<Pick<Category, Key> | null> => {
    return prisma.category.findUnique({
        where: { id },
        select: keys.reduce((obj, k) => ({ ...obj, [k]: true }), {})
    }) as Promise<Pick<Category, Key> | null>;
}

const queryCategories = async <Key extends keyof Category>(
    filter: object = {},
    options: {
        limit? : number;
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
): Promise<Pick<Category, Key>[]> => {
    const page = options.page ?? 1;
    const limit = options.limit ?? 10;
    const sortBy = options.sortBy;
    const sortType = options.sortType ?? 'desc';

    const categories = await prisma.category.findMany({
        where: Object.keys(filter).length ? filter : {},
        select: keys.reduce((obj, k) => ({ ...obj, [k]: true }), {}),
        skip: (page - 1) * limit,
        take: limit,
        orderBy: sortBy ? { [sortBy]: sortType } : undefined
    });

    return categories as Pick<Category, Key>[];
}

const updateCategory = async <Key extends keyof Category> (
    id: number,
    updateBody: Prisma.CategoryUpdateInput,
    keys: Key[] = ['title'] as Key[]
): Promise<Pick<Category, Key> | null> => {
    const category = await getCategoryById(id, ['id', 'title']);
    if (!category) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Category not found');
    }
    
    const updateCategory = await prisma.category.update({
        where: { id: category.id },
        data: updateBody,
        select: keys.reduce((obj, k) => ({ ...obj, [k]: true }), {})
    })

    return updateCategory as Pick<Category, Key> | null;
}

const deleteCategory = async (
    id: number
): Promise<Category> => {
    const category = await getCategoryById(id);
    if (!category) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Category not found');
    }

    return prisma.category.delete({
        where: { id }
    })
}


export default {
    createCategory,
    getCategoryById,
    getCategoryByTitle,
    queryCategories,
    updateCategory,
    deleteCategory
}