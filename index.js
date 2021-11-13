const express = require("express")
const app = express();
const bodyParser = require('body-parser');
const {buyCoin,coinStats} = require('./buyCoin.js')
require('dotenv').config()

app.use(bodyParser.json());


app.get('/:coin',async (req,res)=>{
    res.send(await coinStats(req.params["coin"]));
})


app.post('/',async (req,res)=>{
    if(req.headers['secret'] === process.env.SECRET)
    {
        let sipArray = String(process.env.CRYPTO).split(",")
        console.log(sipArray)
        let results = await Promise.all(sipArray.map(async(coin)=>{
            return await buyCoin(coin);
        }))
        results.forEach(x=>{
            if(x.status==0){
                return res.status(404).json({message:"Something wrong with SIP.Reason:- "+x.data});
            }
        })
        res.status(200).json({message:"SIP invested Successfully"});
    }
    return res.status(401).json({message: 'Unauth'})
    
})

app.listen(process.env.PORT,()=>{
    console.log("Server Running on "+process.env.PORT);
})
