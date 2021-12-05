const express=require('express')
const { requireSignin } = require('../controllers/authController')
const { helloFunctions, postCategory, showCategoryList, categoryDetails, updateCategory, deleteCategory } = require('../controllers/categorycontroller')
const router=express.Router()

router.get('/test',helloFunctions)
router.post('/postcategory',requireSignin,postCategory)
router.get('/categorylist',showCategoryList)
router.get('/categorydetails/:id',categoryDetails)
router.put('updatecategory/:id',requireSignin,updateCategory)
router.delete('deletecategory/:id',requireSignin,deleteCategory)




module.exports=router