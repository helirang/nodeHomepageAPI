import dotenv from "dotenv";
import jwt from "jsonwebtoken"

dotenv.config();

class options implements jwt.SignOptions{
    algorithm?: jwt.Algorithm = 'HS256';
    expiresIn?: string = process.env.expiresIn;
    issuer?: string = process.env.issuer;
};

const generateAccessToken = (id:string)=>{
    let temp:any = process.env.ACCESS_TOKEN_SECRET;
    let jwtOption = JSON.parse(JSON.stringify(new options()));
    return jwt.sign({id},temp,jwtOption);
};

const generateRefreshToken = (id:string) => {
    let temp:any = process.env.ACCESS_TOKEN_SECRET;
    let jwtOption = JSON.parse(JSON.stringify(new options()));
    jwtOption.expiresIn = process.env.refExpiresIn;
    return jwt.sign({id},temp,jwtOption);
};

export default generateAccessToken;
