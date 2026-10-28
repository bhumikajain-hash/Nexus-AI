const userModel = require('../models/user.model')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')


async function registerUser(req,res){
    const {fullName:{firstName, lastName},email,password}= req.body

    const userAlreadyExists = await userModel.findOne({email})

    if(userAlreadyExists){
        return res.status(400).json({
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
    res.cookie('token', token, {
        httpOnly: true,
        secure: true,
        sameSite: 'none'
    })
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
        return res.status(400).json({
            message:"Invalid Email or Password"
        })
    }

    const isPasswordValid = await bcrypt.compare(password, user.password)
    if(!isPasswordValid){
        return res.status(400).json({
            message:"Invalid Email or Password"
        })
    }

    const token = jwt.sign({id:user._id}, process.env.JWT_SECRET_KEY)
    res.cookie('token', token, {
        httpOnly: true,
        secure: true,
        sameSite: 'none'
    })
    res.status(200).json({
        message:"User logged In Successfully",
        user:{
            email:user.email,
            fullName:user.fullName,
            id:user._id
        }
    })

}

async function logoutUser(req, res) {
    try {
        // Clear the cookie storing the auth token
       res.clearCookie('token', { 
            httpOnly: true, 
            secure: true,
            sameSite: 'none' 
        });

        return res.status(200).json({ message: "Logged out successfully" });
    } catch (error) {
        console.error("Logout error:", error);
        return res.status(500).json({ message: "Server error during logout" });
    }
}

async function getProfile(req, res) {
    try {
        return res.status(200).json({ user: req.user });
    } catch (error) {
        return res.status(500).json({ message: "Server error", error: error.message });
    }
}

module.exports = {
    registerUser,
    loginUser,
    logoutUser,
    getProfile
}