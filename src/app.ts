import express from 'express';
import morgan from 'morgan';
import router from './router';
import logger from './module/logger/winston';
import { streamLogger } from './module/logger/winston';
const app: express.Application = express();

app.use(express.json());
app.use(express.urlencoded({
    extended:true
}));
app.use(morgan('dev', { stream: streamLogger }));
app.use(router);
app.use((req,res,next)=>{
    let recordWarn = 'wrong access point : '+req.path;
	res.status(404).send('404 not found');
    logger.warn(recordWarn);
});
app.use(function(err:any,req:express.Request,res:express.Response,next:express.NextFunction){
    let recordError:string;
    let {pw} = req.body;
    recordError = pw ? 
    err+'[path]:'+req.method+' '+req.path: 
    err+' [body]:'+JSON.stringify(req.body)+' [path]:'+req.path;
    logger.error(recordError);
});

app.listen(2900, () => {
console.log(`Example app listening at http://localhost:2900`);
});