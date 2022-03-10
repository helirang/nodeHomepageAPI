import {DB, ResultData} from "../../db";
import security from '../../config/security'

const CreateUser = async function(id:string, pw:string, email:string, name:string){
    let query ='INSERT INTO user(id,pw,email,name,salt) VALUES(?,?,?,?,?)';
    let params = [], result= new ResultData;

    if(!id || !name || !email || !pw){
        result = { state : false, warning : 'some data empty'};
        return result;
    }
    const {password, salt} = await security.createHashedPassword(pw);

    params.push(id,password,email, name,salt);
    result = await DB('post',query,params);

    return result;
};

const ReadUser = async (id:string)=>{
    let query = `SELECT id,email,name FROM user WHERE id=?`;
    let params = [], result= new ResultData;
 
    if(!id){
        result = { state : false, warning : 'need user id'};
        return result;
    }

    params.push(id);
    result = await DB('get',query,params);
    return result;
}

const UpdateUser =  async function(id:string,newId:string, pw:string, email:string, name:string){
    let query = 'UPDATE user SET id=?,pw=?,email=?,name=?,salt=? WHERE id = ?';
    let params = [], result= new ResultData;

    if(!id || !newId || !name || !email || !pw ){
        result = { state : false, warning : 'some data empty'};
        return result;
    }
    const {password, salt} = await security.createHashedPassword(pw);

    params.push(newId,password,email, name,salt,id);
    result = await DB('put',query,params);

    return result;
}

const DeleteUser = async(id:string)=>{
    let query = 'DELETE FROM user WHERE id=?';
    let params = [], result= new ResultData;

    if(!id){
        result = { state : false, warning : 'need user id'};
        return result;
    }

    params.push(id);
    result = await DB('delete',query,params);
    return result;
}

const CheckID = async(id:string)=>{
    let query = 'SELECT id FROM user WHERE id=?';
    let params = [id], dbresult= new ResultData, result=new ResultData;

    if(!id){
        result = { state : false, warning : 'need user id'};
        return result;
    }
    dbresult = await DB('get',query,params);

    result = dbresult.state ? 
    { state : false, warning : 'same id exist'} :
    { state : true };

    return result;
}

const CheckEmail = async(email:string):Promise<ResultData>=>{
    let query = 'SELECT email FROM user WHERE email=?';
    let params = [email], dbresult= new ResultData, result=new ResultData;

    if(!email){
        result = { state : false, warning : 'need user email'};
        return result;
    }
    dbresult = await DB('get',query,params);

    result = dbresult.state ? 
    { state : false, warning : 'same email exist'} :
    { state : true };

    return result;
}

export default {
    CreateUser,
    ReadUser,
    UpdateUser,
    DeleteUser,
    CheckID,
    CheckEmail
};