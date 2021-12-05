const express=require('express')
const { userRegister, postEmailConfirmation, Signin, forgetPassword, resetPassword, signout, userList, userInfo, requireSignin } = require('../controllers/authController')
const router=express.Router()

router.post('/register',userRegister)
router.post('/confirmation/:token',postEmailConfirmation)
router.post('/signin',Signin)
router.post('/forgetpassword',forgetPassword)
router.post('/resetpassword/:token',resetPassword)
router.post('/signout',signout)
router.get('/userlist',requireSignin,userList)
router.get('/userinfo/:id',requireSignin,userInfo)


module.exports=router