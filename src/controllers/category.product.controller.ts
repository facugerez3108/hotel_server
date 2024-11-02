import httpStatus from "http-status";
import catchAsync from "../utils/catchAsync";
import { categoryProductService } from "../services";
import ApiError from "../utils/ApiError";
import pick from "../utils/pick";
import { Request, Response } from "express";

const createCategoryProduct = catchAsync(async (req, res) => {
    const { title } = req.body;
    const productCategory = await categoryProductService.createCategoryProduct(title);
    res.status(httpStatus.CREATED).send(productCategory);
});

const getCategoryProduct = catchAsync(async (req, res) => {
    const id = parseInt(req.params.id, 10);
    const productCategory = await categoryProductService.getCategoryProductById(id);
    if (!productCategory) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Category not found');
    }
    res.send(productCategory);
});

const getCategoriesProduct = catchAsync(async (req, res) => {
    const filter = pick(req.query, ['title']);
    const options = pick(req.query, ['sortBy', 'limit', 'page']);
    const productCategories = await categoryProductService.queryCategoriesProduct(filter, options);
    res.send(productCategories);
});

const updateCategoryProduct = async (req: Request, res: Response) => {
    const { id } = req.params;
    const updateBody = req.body

    try{
        const updatedCategoryProduct = await categoryProductService.updateCategoryProduct(parseInt(id), updateBody);
        res.json(updatedCategoryProduct);  
    }catch(error){  
        console.error("Error updating category:", error);
    }
};

const deleteCategoryProduct = catchAsync(async (req, res) => {
    const id = parseInt(req.params.id, 10);
    await categoryProductService.deleteCategoryProduct(id);
    res.status(httpStatus.NO_CONTENT).send();
});

export default {
    createCategoryProduct,
    getCategoryProduct,
    getCategoriesProduct,
    updateCategoryProduct,
    deleteCategoryProduct
}