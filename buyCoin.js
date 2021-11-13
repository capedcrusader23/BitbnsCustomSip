const { response } = require('express');
const bitbns = require('./bitbns.js')
const fs = require('fs');
const { resolve } = require('path');
require('dotenv').config()

function getCurrentPrice(coinPair) {
    return new Promise((resolve,reject)=>{
        bitbns.getTickerApi(coinPair,function(error, data){
            if(data.code == 403) {
                reject({status:0,data:"Coin does not exist"})
            }
            else{
                resolve(data["data"][coinPair]["last_traded_price"])
            } 
        });
    })
}

function placeMarketOrder(coinPair,quantity) {
    return new Promise((resolve,reject)=>{
        bitbns.placeMarketOrderQnty(coinPair, 'INR', 'BUY', quantity, function(error, data){
                if(error){
                    reject(error)
                }
                else{
                    resolve(data)
                }   
           })
    })
}

function getCoinStats(coinPair) {
    return new Promise((resolve,reject)=>{
        bitbns.currentCoinBalance(coinPair, function(error, data){
            if(!error){
              resolve(data)
            } else {
              reject(error)
            }
        })
    })   
}

function writeOnFile(content){
        return new Promise((resolve,reject)=>{
            fs.writeFile('./failure.txt',content,err=>{
                if(err){
                    reject(err);
                }
            })
            
            resolve("Error logged")
        })
}

async function buyCoin(coinPair) {
    try{
        let coin =coinPair.split("INR")[0];
        console.log(coin,coinPair)
        let price = await getCurrentPrice(coin);
        let minInr = process.env.MIN_INR;
        console.log(minInr,process.env.TO_FIXED)
        let qty = (parseFloat(minInr)/ parseFloat(price)).toFixed(process.env.TO_FIXED)
        console.log("THIS IS QTY",qty)
        let response = await placeMarketOrder(coin,qty);
        if(response.status == 0) {
            throw response
        }
        console.log("Successfully bought crypto of"+coinPair);
        return {status:1, data:"SIP DONE for coinPair "+coinPair};
    }
    catch(error) {
        let content = error.data +"    .Timestamp: "+new Date();
        await writeOnFile(content)
        return error;
    }
}

async function coinStats(coinPair) {
    let data = await getCoinStats(coinPair);
    console.log(data["data"]["availableorderBTC"])
    let stats = "Current wallet holding:- "+data["data"]["availableorderBTC"];
    return stats;
}
module.exports = {buyCoin, coinStats}


