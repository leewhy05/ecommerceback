const USER = require("../model/userModel");
const jwt = require('jsonwebtoken')
const sendEmail = require('../helpers/sendMail')
const crypto = require('crypto')

// registration

const registration = async (req, res) => {
  const { firstname, lastname, email, phonenumber, password, verifypassword } =
    req.body;

  if (
    !firstname ||
    !lastname ||
    !email ||
    !phonenumber ||
    !password ||
    !verifypassword
  ) {
    res
      .status(404)
      .json({ success: false, message: "all fields are required to register" });
    return;
  }
  if (password !== verifypassword) {
    res
      .status(400)
      .json({
        success: false,
        message: "password and verifypassword must be the same",
      });
    return;
  }
  try {
    const user = await USER.create({ ...req.body });
    res
      .status(201)
      .json({ success: true, message: "registration successful", user });
  } catch (error) {
    if (error.code === 11000) {
      res.status(404).json({ success: false, message: "Email already in use" });
      return;
    }
    console.log(error.message);
    res.status(500).send(error);
  }
};

// login
const login = async(req,res)=>{
    const {email,password}= req.body
    if(!email || !password){
        res.status(400).json({success:false,message:'all fields are required to login'})
        return
    }
    try {
        const user = await USER.findOne({email})
        if(!user){
            res.status(404).json({success:false,message:'Wrong credentials'})
            return
        }
        // comparing password and validating password
        const auth = await user.comparePassword(password)
        if(!auth){
          res.status(404).json({success:false,message:'Wrong credentials'})
          return
        }

        // token
        const token = await user.generateToken()
        if(token){
            res.status(201).json({success:true,message:'logged in',user:{
                firstname:user.firstname,
                email:user.email,
                token
            }})
            return
        }
    } catch (error) {
        res.status(500).send(error)
    }
}

//log out
const logout = async (req,res)=>{
    res.status(200).json({token:'', message:'loggedout successfully'})
}

// get user 
const getUser = async(req,res)=>{
    const {userId} = req.user
    const user = await USER.findOne({_id:userId})
    res.status(200).json({success:true,firstname:user.firstname})
}

// is logged in ftn

const isLoggedIn = (req,res)=>{
    try {
        const authHeader = req.headers.authorization;
        const token = authHeader.split(' ')[1]
        if(!token){
            return res.json(false)
        }

        jwt.verify(token,process.env.JWT_SECRETE)
        res.json(true)
    } catch (error) {
        console.log(error.message);
        res.json(false)
    }
}

// forgot password
const forgotPassword = async(req,res)=>{
    const {email} = req.body
    try {
        const user = await USER.findOne({email});
        if(!user){
          return res.status(404).json({success:false,message:'email not sent'})
        }
        const resetToken = user.getResetPasswordToken()
        await user.save()
        const resetUrl = `https://ecommercefront-vert.vercel.app/password/${resetToken}`
        const message = `<h1> You have requested for a password reset</h1>
        <p> Please go to this link to reset your password</p> <a href=${resetUrl} clicktracking = off> ${resetUrl} </a> `
        try {
          await sendEmail({
            to:user.email,
            subject:'Password Reset Request',
            text:message
          })
          res.status(200).json({success:true,message:'Email sent'})
        } catch (error) {
          user.getResetPassswordToken = undefined
          user.getResetPasswordExpire = undefined
          await user.save()
            return res.status(500).json({ message: "Email couldnt be sent", error })
          
        }
    } catch (error) {
      res.json(error.message)  
    }
}

// reset password function
const resetPassword = async(req,res)=>{
  const resetPasswordToken = crypto.createHash('sha256').update(req.params.resetToken).digest('hex')
  try {
    const user =  await USER.findOne({
      resetPasswordToken,
      resetPasswordExpire:{$gt:Date.now()}
    })
    if(!user){
      return res.status(400).json({status:false,message:'Invalid Reset token'})
    }
    user.password = req.body.password
    user.resetPasswordToken = undefined
    user.resetPasswordExpire = undefined

    await user.save()
    res.status(201).json({success:true,message:'Password reset successfully'})
  } catch (error) {
    console.log(error);
    res.status(500).json(error.message)
  }
}

module.exports = {
  registration,
  login,
  logout,
  getUser,
  isLoggedIn,
  forgotPassword,
  resetPassword 

};
