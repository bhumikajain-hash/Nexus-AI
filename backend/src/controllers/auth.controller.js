const userModel = require('../models/user.model')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')


async function registerUser(req,res){
    const {fullName:{firstName, lastName},email,password}= req.body

    const userAlreadyExists = await userModel.findOne({email})

    if(userAlreadyExists){
        res.status(400).json({
            message:"User Already Exists"
        })
    }

    const hashPassword = await bcrypt.hash(password, 10)

    const user = await userModel.create({
        fullName: {
            firstName,
            lastName
        },
        email,
        password: hashPassword

    })

    const token = jwt.sign({id:user._id}, process.env.JWT_SECRET_KEY)
    res.cookie('token', token)
    res.status(201).json({
        message:"User Registered Successfully",
        user:{
            id:user._id,
            fullName:user.fullName,
            email:user.email
        }
    })
}

async function loginUser(req,res){
    const {email,password} = req.body

    const user = await userModel.findOne({email})
    if(!user){
        res.status(400).json({
            message:"Invalid Email or Password"
        })
    }

    const isPasswordValid = await bcrypt.compare(password, user.password)
    if(!isPasswordValid){
        res.status(400).json({
            message:"Invalid Email or Password"
        })
    }

    const token = jwt.sign({id:user._id}, process.env.JWT_SECRET_KEY)
    res.cookie('token', token)
    res.status(200).json({
        message:"User logged In Successfully",
        user:{
            email:user.email,
            fullName:user.fullName,
            id:user._id
        }
    })

}

module.exports = {
    registerUser,
    loginUser
}