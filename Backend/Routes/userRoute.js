import express from 'express';
import {loginUser, logoutUser} from '../Controllers/userController.js';

const userRouter = express.Router();

userRouter.post('/loginUser', loginUser);
userRouter.post('/logoutUser', logoutUser);

export default userRouter;