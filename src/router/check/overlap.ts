import express from 'express';
import userCtrl from '../../controller/users/user.ctrl';

const overlap = express.Router();

overlap.get('/',userCtrl.CheckIdOrEmail);

export default overlap;