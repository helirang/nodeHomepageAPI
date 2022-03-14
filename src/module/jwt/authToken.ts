import jwt from "jsonwebtoken"
import express from 'express';
import dotenv from "dotenv";

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

const userAccessToken = (req:express.Request,res:express.Response,next:Function)=>{
    let result = new ResultAuthData;
    let token = req.cookies !== undefined ? req.cookies.token : undefined;
    //let token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjE2IiwiaWF0IjoxNjQ3MjE4MDQ2LCJleHAiOjE2NDczMDQ0NDYsImlzcyI6ImV6b25lIn0.dbDkS-5kVvzeDWc_gTAatsXK7sBhFeuoTPLpNCZvGJ4";
    console.log(req.cookies);
    if(token===undefined){
        result.warning = 'none token';
        res.send(result);
        return;
    }

    let secret:any = process.env.ACCESS_TOKEN_SECRET;
    let temp3 = jwt.verify(token, secret, (err:any, decoded:any) =>{
        if (err) {
            result.warning = 'failed to authenticate token';
            res.send(result);
            next(err);
            //res.status(401).json({ error: 'Unauthorized', message: 'failed to authenticate token' });
            return;
        }else{
            // req.url을 가공하면 접근하기를 원하는 유저 정보(id)를 파악 가능 
            let tempId = (req.url).replace('/','');
            if(decoded.iss !== 'ezone' || decoded.id !== tempId){
                result.warning = 'abnormal access'
                res.send(result);
            }else{
                next();
            }
        }
    });
};

const dataAccessToken = (req:express.Request,res:express.Response,next:Function)=>{
    let result = new ResultAuthData;
    let token = req.cookies !== undefined ? req.cookies.token : undefined;
    // let token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjE2IiwiaWF0IjoxNjQ3MjE4MDQ2LCJleHAiOjE2NDczMDQ0NDYsImlzcyI6ImV6b25lIn0.dbDkS-5kVvzeDWc_gTAatsXK7sBhFeuoTPLpNCZvGJ4";
    if(token===undefined){
        result.warning = 'none token';
        res.send(result);
        return;
    }

    let secret:any = process.env.ACCESS_TOKEN_SECRET;
    let temp3 = jwt.verify(token, secret, (err:any, decoded:any) =>{
        if (err) {
            result.warning = 'failed to authenticate token';
            res.send(result);
            next(err);
            return;
        }else{
            req.body.auth = decoded.id;
            if(decoded.iss !== 'ezone'){
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

export default {
    userAccessToken,
    dataAccessToken
}