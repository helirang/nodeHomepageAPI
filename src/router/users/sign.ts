import express from 'express';
import userCtrl from '../../controller/users/user.ctrl';

const sign = express.Router();

sign.post('/',userCtrl.Create); //유저 생성

export default sign;