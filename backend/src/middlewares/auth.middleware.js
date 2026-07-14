const express =  require('express')
const jwt = require('jsonwebtoken')
const userModel = require('../models/user.model')

async function auth_User_Middleware(req, res, next){
    //req.cookies returns an object and jwt.verify accepts a string therefore we are using here req.cookies.token to get the token from cookies in string format
    const token = req.cookies.token
    if(!token){
        return res.status(401).json({
            message:"Unauthorized"
        })
    }

    try{

        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY)
        const user = await userModel.findById(decoded.id)

        req.user = user
        next()


    }catch(err){
        res.status(401).json({
            message:"Unauthorized user"
        })
    }
}

module.exports ={
    auth_User_Middleware
}