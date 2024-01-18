const express = require('express')
const router = express.Router()
const auth = require('../middleware/auth')
const { order, getOrders, getAllOrdersByUser } = require('../controller/orderController')
const restrict = require('../middleware/isAdmin')



//create 
router.post('/order',auth, order)

router.get('/orders',auth, restrict('admin'), getOrders);

router.get('/orders/:userId',auth,getAllOrdersByUser)



module.exports = router