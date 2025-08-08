import express,{Request,Response} from "express"
import logger from "./utils/logger";
import httpProxy from "http-proxy"


const app=express()
const PORT=8000;

const basepath="https://s3.us-east-1.amazonaws.com/hostmysite.io"
const proxy=httpProxy.createProxy()



app.use((req: Request, res: Response, next) => {
  console.log(`📦 Incoming request: ${req.method} ${req.url}`);
  next();
});

app.use((req:Request,res:Response)=>{
    const hostname = req.hostname
    const subdomain =hostname.split('.')[0]


    const resovleTo=`${basepath}/${subdomain}`
    proxy.web(req,res,{target:resovleTo,changeOrigin:true})

})

proxy.on('proxyReq', (proxyReq, req, res) => {
    const url = req.url;
    if (url === '/')
        proxyReq.path += 'index.html'

})








app.listen(PORT,()=>{
    logger.info("proxy running on port 8000");
})