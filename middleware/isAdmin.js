const userModel = require('../model/userModel')


const restrict = (role)=>{
    return(req,res,next)=>{
        if(req.user.role !== role){

            res.status(403).json({success:false,message:"You do not have permission to perform this action"})
            return
        }
        next()
    }
}

module.exports =restrict