const mongoose = require('mongoose')

const MONGODB_URI = process.env.MONGODB_URI

const connect = async(req,res)=>{
    try {
        await mongoose.connect(MONGODB_URI)
        console.log('mongodb connected successfully');
    } catch (error) {
     console.log(error);  
    }
}
module.exports = connect;