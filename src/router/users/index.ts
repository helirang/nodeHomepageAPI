import express from 'express';
import userCtrl from '../../controller/users/user.ctrl';

const user = express.Router();

// user.get('/'); //유저 전체 읽기
// user.post('/',userCtrl.Create); //유저 생성

user.get('/:id',userCtrl.Read);//해당 유저 읽기
user.put('/:id',userCtrl.Update);//해당 유저 정보 변경
user.delete('/:id',userCtrl.Delete);//해당 유저 탈퇴

export default user;