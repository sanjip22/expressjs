const multer=require('multer')
const fs=require('fs')
const path=require('path')

const storage=multer.diskStorage({
    destination:(req,file,cb)=>{
        let fileDestination='public/uploads/'
        //check if directory exists
        if(!fs.existsSync(fileDestination)){
            fs.mkdirSync(fileDestination,{recursive:true})
            cb(null,fileDestination)
        }
        else{
            cb(null,fileDestination)
        }
    },
    filename:(req,file,cb)=>{
        let filename=path.basename(file.originalname,path.extname(file.originalname))
        //abc.jpg
        //.jpg
        //path.basename(abc.jpg,.jpg)
        //abc

        let ext=path.extname(file.originalname)
        //.jpg
        cb(null,filename+'-'+Date.now()+ext)
    }
})

let imageFilter=(req,file,cb)=>{
    if(!file.originalname.match(/\.(jpg|png|jpeg|svg|jfif|gif|JPG|PNG|JPEG|SVG|JFIF|GIF)$/)){
        return cb(new Error('You can upload image file only'),false)
    }
    else{
        cb(null,true)
    }
}


const upload=multer({
    storage:storage,
    fileFilter:imageFilter,
    limits:{
        fileSize:2000000  //2MB
    }
})

module.exports=upload