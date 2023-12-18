require('dotenv/config')
const express = require('express')
const app = express()
const cors = require('cors')
const morgan = require('morgan')
const port = process.env.PORT || 9000
const connect =require('./config/db')
const productRoute = require('./routes/productRoute')
const userRoute = require ('./routes/userRoute')
const orderRoute = require('./routes/orderRoute')


// custom middlewares
app.use(cors())
app.use(express.json())
app.use(morgan('dev'))

//Apis
app.use('/api/products',productRoute)
app.use('/api/user',userRoute)
app.use("/api",orderRoute)

// server and db
connect()
.then(()=>{
    try {
        app.listen(port,(req,res)=>{
            console.log(`Server is connected to http://localhost:${port}`);
        })
        
    } catch (error) {
        console.log('cannot connect to the server');
    }
})
.catch((error)=>{
    console.log('invalid database connection');
})


//routes
app.get('/',(req,res)=>{
    res.status(200).send({message:'app is running'})
})
app.use((req,res)=>{
    res.status(404).json({message:'This route does not exist'})
})