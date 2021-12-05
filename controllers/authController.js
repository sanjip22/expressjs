const User=require('../model/authModel')
const Token=require('../model/tokenModel')
const sendEmail=require('../utils/setEmail')
const crypto=require('crypto')
const jwt=require('jsonwebtoken')//authentication
const expressJwt=require('express-jwt')//authorization


//to register user

exports.userRegister=async(req,res)=>{
    let user= new User({
        name:req.body.name,
        email:req.body.email,
        password:req.body.password
    })
    User.findOne({email:user.email},async(error,data)=>{
        if(data==null){
            user = await user.save()
    if(!user){
        return res.status(400).json({error:'something went wrong'})
    }
        let token= new Token({
            token:crypto.randomBytes(16).toString('hex'),
            userId:user._id
        })
        token=await token.save()
        if(!token) {
            return res.status(400).json({error:"something went wrong"})
        }


    //send Email
    sendEmail({
        from:'no-reply@expresscommerce.com',
        to:user.email,
        subject:'Email Verification Link',
        text:`Hello, \n\n
        Please Verify Your account by click in the link below:\n\n 
        http:\/\/${req.headers.host}\/api\/confirmation\/${token.token}`
        //http:localhost:8000/api/confirmation/tokenvalue
    })


    res.send(user)

        }
        else{
            return res.status(400).json({error:'email must be unique'})
        }
    })
    
}


//confirming email
exports.postEmailConfirmation=(req,res)=>{
    //at first find the valid or matching token
    Token.findOne({token:req.params.token},(error,token)=>{
        if(error || !token){
            return res.status(400).json({error:'invalid token or token may have expired'})
        }
        // if we found the valid token then find the valid user
        User.findOne({_id:token.userId},(error,user)=>{
            if(error || !user){
                return res.status(400).json({error:'we are unable to find the valid user for this token'})
            }
            //check if user is already verified or not 
            if(user.isVerified){
                return res.status(400).json({error:'email is already verified,login to continue'})
            }
            //save the verfied user
            user.isVerified=true
            user.save((error)=>{
                if(error){
                    return res.status(400).json({error:error})
                }
                res.json({message:'congrats,your account has been verified'})
            })
        })
    })
}

//signin process
exports.Signin=async(req,res)=>{
    const{email,password}=req.body
   //email=req.body.email
   // password=req.body.passwword

   //at first check if the email is registered in the system or not 
   const user=await User.findOne({email})
   if(!user){
       return res.status(400).json({error:"sorry the email yuou provided not found in our system, please try another"})

   }
   //if email found then check password for the email
   if(!user.authenticate(password)){
       return res.status(400).json({error:"email or password doesnot match"})
   }
   //check if user is verified or not 
   if(!user.isVerified){
       return res.status(400).json({error:"verify your email first to continue"})
   }
   //now generate token with user id and jwt secret
   const token=jwt.sign({_id:user._id,user:user.role},process.env.JWT_SECRET)

   //store token in the cookie
   res.cookie('myCookie',token,{expire:Date.now()+999999})

   //return user information to frontend
   const{_id,name,role}=user
   return res.json({token,user:{name,email,role,_id} })
}

//forget password 
exports.forgetPassword=async(req,res)=>{
    const user= await User.findOne({email:req.body.email})
    if(!user){
        return res.status(400).json({error:"sorry the email you provided not found in our system"})
    }
    let token=new Token({
        userId:user.id,
        token:crypto.randomBytes(16).toString('hex')
    })
    token = await token.save()
    if(!token){
        return res.status(400).json({error:'something went wrong'})
    }
    //sendEmail
    sendEmail({
        from:'no-reply@expresscommerce.com',
        to:user.email,
        subject:'Password Reset Link',
        text:`Hello, \n\n
        Please Reset Your password by click in the link below:\n\n 
        http:\/\/${req.headers.host}\/api\/resetpassword\/${token.token}`
        //http:localhost:8000/api/resetpassword/tokenvalue
    })
    res.json({message:"password reset link has been sent to your email"})

}

//reset password
exports.resetPassword=async(req,res)=>{
    //first find the valid token 
    let token=await Token.findOne({token:req.params.token})
    if(!token){
        return res.status(400).json({error:"invalid token or token may have expired"})
    }
    //if token found then find the valid user for thatv token
    let user= await User.findOne({
        _id:token.userId,
        email:req.body.email
    })
    if(!user){
        return res.status(400).json({error:"sorry the email you provided not associated with this token"})
    }
    user.password=req.body.password

    user= await user.save()
    if(!user){
        return res.status(400).json({error:"failed to reset password"})
    }
    res.json({message:"password has been reset successfully,login to continue"})
}


//signout 
exports.signout=(req,res)=>{
    res.clearCookie('myCookie')
    res.json({message:"signout success"})
}

//user list
exports.userList=async(req,res)=>{
    const user= await User.find().select('-hased_password')
    if(!user){
        return res.status(400).json({error:"something went wrong"})
    }
    res.send(user)

}
//user details
exports.userInfo=async(req,res)=>{
    const user=await User.findById(req.params.id).select('-hased_password')
    if(!user){
        return res.status(400).json({error:"something went wrong"})
    }
    res.send(user)
}

//require signin
exports.requireSignin=expressJwt({
    secret:process.env.JWT_SECRET,
    algorithms:['HS256'],
    userProperty:'auth'
})

