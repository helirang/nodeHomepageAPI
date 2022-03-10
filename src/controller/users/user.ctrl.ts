import userDao from "../../dao/users/user.dao";

class ResultUserData{
    state:boolean=false;
    error?:any;
    warning?:string;
    data?: object | string;
    constructor(){
            this.state = false;
            this.warning = '';
        }
}

const Create = async (req:any,res:any,next:Function)=>{
    let dbResult, checkID,checkEmail;
    let result= new ResultUserData;
    let {id,password,email,name} = req.body;

    checkID = await userDao.CheckID(id);
    checkEmail = await userDao.CheckEmail(email);

    if(!checkID.state) result.warning = 'same id exist,';
    if(!checkEmail.state) result.warning += ' same email exist';

    if(result.warning===''){
        dbResult = await userDao.CreateUser(id,password,email,name);
        if(dbResult.state){
            result = {state:true, data :'user create complete'}
        }else{
            if(dbResult?.error)result.error = 'server error';
            else result.warning = dbResult.warning;
        }
    }
   
    res.send(result);
    if(dbResult?.error) next(dbResult.error);
}

const Read = async(req:any,res:any,next:Function)=>{
    let dbResult;
    let result=new ResultUserData;
    let id = req.params.id === undefined ? req.body.id : req.params.id;

    dbResult = await userDao.ReadUser(id);
    if(dbResult.state) result = {state:true, data :dbResult.data[0]}
    else{
        if(dbResult?.error)result.error = 'server error';
        else result.warning = dbResult.warning;
    }
   
    res.send(result);
    if(dbResult?.error) next(dbResult.error);
}

const Update = async(req:any,res:any,next:Function)=>{
    let dbResult, checkID,chkNewEmail,chkNewId;
    let result= new ResultUserData;
    let {id} = req.params;
    let {newId,password,newEmail,name} = req.body;

    if(!id || !newId || !password || !newEmail || !name){
        result.warning = 'some date empty';
        res.send(result);
        return;
    }

    checkID = await userDao.CheckID(id);
    chkNewId = await userDao.CheckID(newId);
    chkNewEmail = await userDao.CheckEmail(newEmail);

    if(checkID.state) {
        result.warning = 'id non exist,';
        res.send(result);
        return;
    }
    if(!chkNewId.state) result.warning += 'change id already exist,';
    if(!chkNewEmail.state) result.warning += ' change email already exist';

    if(result.warning===''){
        dbResult = await userDao.UpdateUser(id,newId,password,newEmail,name);
        if(dbResult.state){
            result = {state:true, data :'user update complete'}
        }else{
            if(dbResult?.error)result.error = 'server error';
            else result.warning = dbResult.warning;
        }
    }
   
    res.send(result);
    if(dbResult?.error) next(dbResult.error);
}

const Delete = async(req:any,res:any,next:Function)=>{
    let dbResult;
    let result=new ResultUserData;
    let id = req.params.id;

    dbResult = await userDao.DeleteUser(id);
    if(dbResult.state) result = {state:true, data : 'delete completed'}
    else{
        if(dbResult?.error)result.error = 'server error';
        else result.warning = dbResult.warning;
    }
    res.send(result);
    if(dbResult?.error) next(dbResult.error);
}

const CheckIdOrEmail = async(req:any,res:any,next:Function)=>{
    let result=new ResultUserData;
    let {id, email} = req.query;

    if(id){
        result = await userDao.CheckID(id);
    }else if(email){
        result = await userDao.CheckEmail(email);
    }else{
        result = {state:false,warning:'ID or Eamil Empty'}
    }
    
    res.send(result);
};

export default {
   Create,
   Update,
   Read,
   Delete,
   CheckIdOrEmail
};