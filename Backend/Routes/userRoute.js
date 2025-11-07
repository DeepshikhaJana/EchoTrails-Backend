import express from 'express';
import {loginUser, logoutUser, signUp} from '../Controllers/userController.js';
import auth from '../Middlewares/auth.js';

const userRouter = express.Router();

userRouter.post('/login', loginUser);
userRouter.post('/logout', auth, logoutUser);
userRouter.post('/signUp', signUp);


export default userRouter;