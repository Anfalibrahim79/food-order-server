const router = require('express').Router()
const productRoute = require('./product/router')
const categoriesRoute = require('./category/router')
const tagRoute = require('./tag/router')
const authRoute = require('./auth/router')
const deliveryRoute = require('./deliveryAddress/router')
const cartRoute = require('./cart/router')
const orderRoute = require('./order/router')
const invoiceRoute = require('./invoice/router')


router.use('/products', productRoute)
router.use('/categories', categoriesRoute)
router.use('/tags', tagRoute)
router.use('/auth', authRoute)
router.use('/delivery-addresses', deliveryRoute)
router.use('/carts', cartRoute)
router.use('/order', orderRoute)
router.use('/invoice', invoiceRoute)



module.exports = router