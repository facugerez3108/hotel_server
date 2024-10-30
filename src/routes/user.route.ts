import express from 'express';
import userController from '../controllers/user.controller';
import validate from '../middlewares/validate';
import { userValidation } from '../validations';


const router = express.Router();


router
  .route('/')
  .post(validate(userValidation.createUser), userController.createUser)
  .get(validate(userValidation.getUsers), userController.getUsers);

router
  .route('/role')
  .get(validate(userValidation.getUser), userController.getUserRoleCtlr)

router
    .route('/:id')
    .get(validate(userValidation.getUser), userController.getUser)
    .patch(validate(userValidation.updateUser), userController.updateUser)
    .delete(validate(userValidation.deleteUser), userController.deleteUser);


export default router;