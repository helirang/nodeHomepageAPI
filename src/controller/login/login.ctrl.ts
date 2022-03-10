import crypto from 'crypto'
import {DB} from "../../db";
import generateAccessToken from '../../module/jwt/generate';

class ResultLoginData{
    state:boolean=false;
    error?:any;
    warning?:string;
    data?: object | string;
    constructor(){
            this.state = false;
        }
}

const login = async function(req:any,res:any){
    let query = 'SELECT pw,salt FROM user WHERE id=?';
    let {id,password} = req.body;
    let params = [id];
    let result = new ResultLoginData;
    let checkPw:string, data:any;
    let dbResult:any;

    if(!id || !password){
        result.warning = 'ID or Password Non exist';
        res.send(result);
        return;
    }

    dbResult = await DB('get',query,params);
    //DB 결과가 실패이면 fail을 전송하고 함수 리턴 (해당 user가 없을 시, 실패)
    if(!dbResult.state){
        result.warning = '존재하지 않는 아이디입니다.';
        res.send(result);
        return;
    }
    data = dbResult.data;
    //비밀번호 비교를 위해, salt를 사용해 비밀번호를 암호화
    checkPw = await makePasswordHashed(password,data[0].salt);

    if(data[0].pw == checkPw) {
        result = {"state":true};
        let token = generateAccessToken(id);
        res.cookie('token',token,{maxAge:0});
    }else{
        result.warning = '아이디나 비밀번호가 틀렸습니다';
    }
    res.send(result);
};

function makePasswordHashed(plainPassword:string,salt:string){
    return new Promise<string>(async (resolve, reject) => {
        // salt를 가져오는 부분은 각자의 DB에 따라 수정
        crypto.pbkdf2(plainPassword, salt, 9999, 64, 'sha512', (err, key) => {
            if (err) reject(err);
            resolve(key.toString('base64'));
        });
    })
};
export default {login};