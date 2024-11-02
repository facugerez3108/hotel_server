import httpStatus from "http-status";
import ApiError from "../utils/ApiError";
import { Category_Product, Prisma } from "@prisma/client";
import prisma from "../client";


const createCategoryProduct = async (
    title: string
): Promise<Category_Product> => {
    if(await getCategoryProductByTitle(title)){
        throw new ApiError(httpStatus.BAD_REQUEST, 'Category already exists')
    }

    return prisma.category_Product.create({
        data: {
            title,
        }
    })
}

const getCategoryProductByTitle = async <Key extends keyof Category_Product>(
    title: string,
    keys: Key[] = ['id', 'title', 'createdAt', 'updatedAt'] as Key[]
): Promise<Pick<Category_Product, Key> | null> => {
    return prisma.category_Product.findUnique({
        where: { title },
        select: keys.reduce((obj, k) => ({ ...obj, [k]: true }), {})
    }) as Promise<Pick<Category_Product, Key> | null>;
}

const getCategoryProductById = async <Key extends keyof Category_Product>(
    id: number,
    keys: Key[] = ['id', 'title', 'createdAt', 'updatedAt'] as Key[]
): Promise<Pick<Category_Product, Key> | null> => {
    return prisma.category_Product.findUnique({
        where: { id },
        select: keys.reduce((obj, k) => ({ ...obj, [k]: true }), {})
    }) as Promise<Pick<Category_Product, Key> | null>;
}

const queryCategoriesProduct = async <Key extends keyof Category_Product>(
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
): Promise<Pick<Category_Product, Key>[]> => {
    const page = options.page ?? 1;
    const limit = options.limit ?? 10;
    const sortBy = options.sortBy;
    const sortType = options.sortType ?? 'desc';

    const categories = await prisma.category_Product.findMany({
        where: Object.keys(filter).length ? filter : {},
        select: keys.reduce((obj, k) => ({ ...obj, [k]: true }), {}),
        skip: (page - 1) * limit,
        take: limit,
        orderBy: sortBy ? { [sortBy]: sortType } : undefined
    });

    return categories as Pick<Category_Product, Key>[];
}

const updateCategoryProduct = async <Key extends keyof Category_Product> (
    id: number,
    updateBody: Prisma.Category_ProductUpdateInput,
    keys: Key[] = ['title'] as Key[]
): Promise<Pick<Category_Product, Key> | null> => {
    const category = await getCategoryProductById(id, ['id', 'title']);
    if (!category) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Category not found');
    }
    
    const updateCategory = await prisma.category_Product.update({
        where: { id: category.id },
        data: updateBody,
        select: keys.reduce((obj, k) => ({ ...obj, [k]: true }), {})
    })

    return updateCategory as Pick<Category_Product, Key> | null;
}

const deleteCategoryProduct = async (
    id: number
): Promise<Category_Product> => {
    const category = await getCategoryProductById(id);
    if (!category) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Category not found');
    }

    return prisma.category_Product.delete({
        where: { id }
    })
}

export default {
    createCategoryProduct,
    getCategoryProductByTitle,
    getCategoryProductById,
    queryCategoriesProduct,
    updateCategoryProduct,
    deleteCategoryProduct
}