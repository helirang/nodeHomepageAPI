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
    let regEmail = /^[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/i;
    let regPw =  /^(?=.*[a-zA-z])(?=.*[0-9])(?=.*[$`~!@$!%*#^?&\\(\\)\-_=+]).{8,16}$/;
    checkID = await userDao.CheckID(id);
    checkEmail = await userDao.CheckEmail(email);

    //정규화 체크
    if(!regEmail.test(email)) result.warning = '이메일 형식이 맞지 않습니다.';
    if(!regPw.test(password)) result.warning += ' 비밀번호는 영문,숫자,특수문자를 최소 한가지씩 조합한 8~16자리여야 합니다.';
    //정규화 실패 결과가 한개라도 있으면 res, return;
    if(result.warning!==''){
        res.send(result);
        return;
    }
    
    // id 및 email 중복 테스트
    if(!checkID.state) result.warning = 'same id exist,';
    if(!checkEmail.state) result.warning += ' same email exist';

    // 중복 테스트 결과가 정상이면 유저 생성 진행
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

    checkID = await userDao.ReadUser(id);

    if(!checkID.state) {
        result.warning = 'id non exist,';
        res.send(result);
        return;
    }

    //바꿀려는 id가 기존 아이디와 같으면 조회 없이 pass
    if(newId !== checkID.data[0].id){
        chkNewId = await userDao.CheckID(newId);
        if(!chkNewId.state) result.warning += 'change id already exist,';
    }
    
     //바꿀려는 email이 기존 이메일과 같으면 조회 없이 pass
    if(newEmail !== checkID.data[0].email){
        chkNewEmail = await userDao.CheckEmail(newEmail);
        if(!chkNewEmail.state) result.warning += ' change email already exist';
    }

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