const express=require('express')
const { requireSignin } = require('../controllers/authController')
const { postProduct, productList, productDetails, updateProduct, deleteProduct } = require('../controllers/productController')
const upload = require('../middleware/file-upload')
const { productValidation } = require('../validation')
const router=express.Router()


router.post('/postproduct',requireSignin,upload.single('product_image'),productValidation,postProduct)
router.get('/productlist',productList)
router.get('/productdetails/:id',productDetails)
router.put('/updateproduct/:id',requireSignin,updateProduct)
router.delete('/deleteproduct/:id',requireSignin,deleteProduct)



module.exports=router