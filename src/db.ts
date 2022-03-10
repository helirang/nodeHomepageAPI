import mysql from 'mysql2/promise'
import dotenv from 'dotenv'

dotenv.config();

let db_info ={
    host: process.env.db_host,
    user: process.env.db_user,
    password: process.env.db_password,
    database: process.env.db_database,
    port: Number(process.env.db_port),
    charset: process.env.db_charset,
    connectionLimit: Number(process.env.db_connectionLimit),
    waitForConnections: Boolean(process.env.db_waitForConnections)
}

class ResultData{
    state: boolean = false;
    error?: any;
    warning?: string;
    data?: object | string | any;
}

const pool = mysql.createPool(db_info);

const DB = async(type:string,sql:string,params?:(string|number)[] |(string|number)[][][]):Promise<ResultData>=>{
    let result = new ResultData();
    let keys:string[];
    try{
        let conn = await pool.getConnection();
        try{
            await conn.beginTransaction();
            const [rows] = await conn.query(sql,params);
            if(type === 'get'){
                result = rows.hasOwnProperty([].length) ? 
                {state:true,data:rows} : 
                {state:false,warning:'wrong request or empty data'};
            }else{
                keys = Object.keys(rows);

                result = (<mysql.ResultSetHeader>rows).affectedRows > 0 ? 
                {state:true,data:`${type} completed`} : 
                {state:false,warning:'no matched data'};

                if(result.state){
                    await conn.commit();
                }else if(result.error){
                    throw result.error;
                }
            }
            conn.release();
            return result;
        }catch(err:any){
            result = {state:false,error: '[QueryError]: '+sql}; 
            console.log(result);
            conn.release();
            return result;
        }
    }catch(err:any){
        result =  {state:false,error: '[DBError]: '+sql}; 
        console.log(result);
        return result;
    }
}

export {DB, ResultData};