import httpStatus from "http-status";
import ApiError from "utils/ApiError";
import { Product, Prisma } from "@prisma/client";
import prisma from "../client";

const createProduct = async (
    name: string,
    description: string,
    price: number,
    stock: number,
    code: string,
    category_product_id: number
): Promise<Product> => {
    
    if (await getProductByCode(code)){
        throw new ApiError(httpStatus.BAD_REQUEST, 'El producto ya existe');
    }
    return prisma.product.create({
        data: {
            name,
            description,
            price,
            stock,
            code,
            category_product_id
        }
    });
};

const getProductByCode = async <Key extends keyof Product>(
    code: string,
    keys: Key[] = [
        'id',
        'name',
        'description',
        'price',
        'stock',
        'code',
        'category_product_id',
        'createdAt',
        'updatedAt'
    ] as Key[]
): Promise<Pick<Product, Key> | null> => {
    return prisma.product.findUnique({
        where: {code: code},
        select: keys.reduce((obj, k) => ({...obj, [k]: true}), {})
    }) as Promise<Pick<Product, Key> | null>;
};

const queryProducts = async <Key extends keyof Product>(
    filter: object = {},
    options: {
        limit?: number;
        page?: number;
        sortBy?: string;
        sortType?: string;
    },
    keys: Key[] = [
        'id',
        'name',
        'description',
        'price',
        'stock',
        'code',
        'category_product_id',
        'createdAt',
        'updatedAt'
    ] as Key[]
): Promise<any[]> => {
    const sortBy = options.sortBy;
    const sortType = options.sortType ?? 'desc';
    const limit = options.limit ?? 10;
    const page = options.page ?? 1;

    const products = await prisma.product.findMany({
        where: Object.keys(filter).length ? filter : {},
        select: keys.reduce((obj, k) => ({...obj, [k]: true}), {}),
        orderBy: sortBy ? {[sortBy]: sortType} : undefined,
        take: limit,
        skip: (page - 1) * limit
    });
    return products;
};

const getProductById = async <Key extends keyof Product>(
    id: number,
    keys: Key[] = [
        'id',
        'name',
        'description',
        'price',
        'stock',
        'code',
        'category_product_id',
        'createdAt',
        'updatedAt'
    ] as Key[]
): Promise<Pick<Product, Key> | null> => {
    return prisma.product.findUnique({
        where: {id: id},
        select: keys.reduce((obj, k) => ({...obj, [k]: true}), {})
    }) as Promise<Pick<Product, Key> | null>;
};

const updateProduct = async <Key extends keyof Product>(
    id: number,
    updateBody: Prisma.ProductUpdateInput,
    keys: Key[] = [
        'id',
        'name',
        'description',
        'price',
        'stock',
        'code',
        'category_product_id',
        'createdAt',
        'updatedAt'
    ] as Key[]
): Promise<Pick<Product, Key> | null> => {
    const product = await getProductById(id);
    if (!product) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Producto no encontrado');
    }
    const updateProduct = await prisma.product.update({
        data: updateBody,
        where: {
            id: product.id
        },
        select: keys.reduce((obj, k) => ({...obj, [k]: true}), {})
    });
    return updateProduct as Pick<Product, Key> | null;
};

const deleteProduct = async (id: number): Promise<Product> => {
    const product = await getProductById(id);
    if (!product) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Producto no encontrado');
    }
    await prisma.product.delete({where: {id}});
    return product;
};

export default {
    createProduct,
    getProductByCode,
    queryProducts,
    getProductById,
    updateProduct,
    deleteProduct
};