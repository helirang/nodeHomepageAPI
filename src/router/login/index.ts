import express from 'express';
import loginCtrl from '../../controller/login/login.ctrl';

const login = express.Router();

login.post('/',loginCtrl.login);

export default login;   