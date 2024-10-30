import httpStatus from "http-status";
import catchAsync from "../utils/catchAsync";
import { nivelService } from "../services";
import ApiError from "../utils/ApiError";
import pick from "../utils/pick";
import { Request, Response } from "express";

const createNivel = catchAsync(async (req, res) => {
  const nivel = await nivelService.createNivel(req.body);
  res.status(httpStatus.CREATED).send(nivel);
});

const getNiveles = catchAsync(async (req, res) => {
  const filter = pick(req.query, ["nombre"]);
  const options = pick(req.query, ["sortBy", "limit", "page"]);
  const result = await nivelService.queryNiveles(filter, options);
  res.send(result);
});

const getNivel = catchAsync(async (req, res) => {
  const nivelId = parseInt(req.params.nivelId, 10);  
  const nivel = await nivelService.getNivelById(nivelId);
  if (!nivel) {
    throw new ApiError(httpStatus.NOT_FOUND, "Nivel not found");
  }
  res.send(nivel);
});

const updateNivel = async (req: Request, res: Response) => {
    const { id } = req.params;
    const updateBody = req.body;

    try{
        const updatedNivel = await nivelService.updateNiveles(parseInt(id), updateBody);
        res.json(updatedNivel);
    }catch(error){
        console.error("Error al actualizar el nivel:", error);
    }
}

const deleteNivel = catchAsync(async(req, res) => {
    const nivelId = parseInt(req.params.nivelId, 10);
    await nivelService.deleteNivel(nivelId);
    res.status(httpStatus.NO_CONTENT).send();
})