import httpStatus from "http-status";
import pick from "../utils/pick";
import ApiError from "../utils/ApiError";
import catchAsync from "../utils/catchAsync";
import { userService } from "../services";
import { Request, Response, NextFunction } from "express";

const createUser = catchAsync(async (req, res) => {
  const { name, email, password, role } = req.body;
  const user = await userService.createUser(name, email, password, role);
  res.status(httpStatus.CREATED).send(user);
});

const getUsers = catchAsync(async (req, res) => {
  const filter = pick(req.query, ["name", "role"]);
  const options = pick(req.query, ["sortBy", "limit", "page"]);
  const result = await userService.queryUsers(filter, options);
  res.send(result);
});

const getUser = catchAsync(async (req, res) => {
  const userId = parseInt(req.params.id, 10); // Parse the id as a number
  const user = await userService.getUserById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found");
  }
  res.send(user);
});

const getUserRoleCtlr = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.headers.authorization) {
      throw new ApiError(
        httpStatus.UNAUTHORIZED,
        "Authorization header is missing"
      );
    }

    const token = req.headers.authorization.split(" ")[1];

    // Obtener el rol del usuario usando el servicio getUserRole
    const role = await userService.getUserRole(token);
    res.send({ role });
  } catch (error: any) {
    console.error("Error obteniendo el rol del usuario:", error);
    res.status(error.statusCode || 500).send({ message: error.message });
  }
};

const updateUser = async (req: Request, res: Response) => {
  const { id } = req.params; // Asegúrate de que id es lo que esperas
  const updateBody = req.body;

  try {
    const updatedUser = await userService.updateUserById(
      parseInt(id),
      updateBody
    );
    res.json(updatedUser);
  } catch (error) {
    console.error("Error updating user:", error);
  }
};

const deleteUser = catchAsync(async (req, res) => {
  const id = parseInt(req.params.id);
  await userService.deleteUserById(id);
  res.status(httpStatus.NO_CONTENT).send();
});

export default {
  createUser,
  getUsers,
  getUser,
  updateUser,
  getUserRoleCtlr,
  deleteUser,
};