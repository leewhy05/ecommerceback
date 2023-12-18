const mongoose = require('mongoose')
const Schema = mongoose.Schema

const productSchema = new Schema({
    title:{
        type:String,
        require:[true,"please include the product title"]
    },
    description:{
        type:String,
        require:[true,"please include the product description"]
    },
     image:{
        type:String,
        require:[true,"please include the product url"]
    },
     category:{
        type:String,
        require:[true,"please include the product category"]
    },
     price:{
        type:Number,
        require:[true,"please include the product price"]
    }
},{timestamps:true})

// export
const PRODUCT = mongoose.model('Product',productSchema)

module.exports = PRODUCT