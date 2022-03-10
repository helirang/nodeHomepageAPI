import jwt from "jsonwebtoken"
import express from 'express';
import dotenv from "dotenv";
import gen from './generate'

dotenv.config();

class ResultAuthData{
    state:boolean=false;
    error?:any;
    warning?:string;
    constructor(){
            this.state = false;
        }
}

class options implements jwt.SignOptions{
    algorithm?: jwt.Algorithm = process.env.algorithm as jwt.Algorithm;
    expiresIn?: string = process.env.expiresIn;
    issuer?: string = process.env.issuer;
};

const authenticateAccessToken = (req:express.Request,res:express.Response,next:Function)=>{
    let result = new ResultAuthData;
    let token=req.cookies.token;
    let {id} = req.params;
    if(id===undefined) id = req.body.id;

    if(!token){
        res.send(result);
        return;
    }

    let temp:any = process.env.ACCESS_TOKEN_SECRET;
    let temp3 = jwt.verify(token, temp, (err:any, decoded:any) =>{
        if (err) {
            result.warning = 'failed to authenticate token';
            res.send(result);
            next(err);
            //res.status(401).json({ error: 'Unauthorized', message: 'failed to authenticate token' });
            return;
        }else{
            if(decoded.id !== id){
                result.warning = 'abnormal access'
                res.send(result);
            }else{
                next();
            }
        }
    });
};

// const generateRefreshToken = (id:string) => {
//     let temp:any = process.env.ACCESS_TOKEN_SECRET;
//     let jwtOption = JSON.parse(JSON.stringify(new options()));
//     jwtOption.expiresIn = process.env.refExpiresIn;
//     return jwt.sign({id},temp,jwtOption);
// };

export default authenticateAccessToken;