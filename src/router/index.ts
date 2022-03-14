import express from 'express';
import login from './users/login';
import sign from './users/sign';
import userRouter from './users';
import overlap from './check/overlap';
import lecture_data from './lecture_datas';
import auth from '../module/jwt/authToken';

const router = express.Router();

router.use('/login',login);
router.use('/sign',sign);
router.use('/users',auth.userAccessToken,userRouter);
router.use('/overlap',overlap);
router.use('/lecture-data',auth.dataAccessToken,lecture_data);

export default router;