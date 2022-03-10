import express from 'express';
import login from './login';
import userRouter from './users';
import overlap from './check/overlap';
import generateAccessToken from '../module/jwt/generate';
import authenticateAccessToken from '../module/jwt/authToken';

const router = express.Router();

router.use('/login',login);
router.use('/users',userRouter);
router.use('/overlap',overlap);
router.use('/jwt',generateAccessToken); 

export default router;