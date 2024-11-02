import httpStatus from "http-status";
import catchAsync from "../utils/catchAsync";
import { productService } from "../services";
import pick from "../utils/pick";
import { Request, Response } from "express";
import ApiError from "../utils/ApiError";

const createProduct = catchAsync(async (req, res) => {
    const { name, description, price, stock, code, category_product_id } = req.body;
    const product = await productService.createProduct(
        name,
        description,
        price,
        stock,
        code,
        category_product_id
    );
    res.status(httpStatus.CREATED).send(product);
});

const getProduct = catchAsync(async (req, res) => {
    const id = parseInt(req.params.id, 10);
    const product = await productService.getProductById(id);
    if (!product) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Product not found');
    }
    res.send(product);
});

const getProducts = catchAsync(async (req: Request, res: Response) => {
    const filter = pick(req.query, ['name']);
    const options = pick(req.query, ['sortBy', 'sortType', 'limit', 'page']);
    const result = await productService.queryProducts(filter, options);
    res.send(result);
});

const updateProduct = async (req: Request, res: Response) => {
    const { id } = req.params;
    const updateBody = req.body

    try{
        const updatedProduct = await productService.updateProduct(parseInt(id), updateBody);
        res.json(updatedProduct);  
    }catch(error){  
        console.error("Error updating product:", error);
    }
}; 

const deleteProduct = catchAsync(async (req, res) => {
    const id = parseInt(req.params.id, 10);
    await productService.deleteProduct(id);
    res.status(httpStatus.NO_CONTENT).send();
});

export default {
    createProduct,
    getProduct,
    getProducts,
    updateProduct,
    deleteProduct
};