const Category=require('../model/categoryModel')


exports.helloFunctions=(req,res)=>{


    res.send('this is a function controller')
}

//to post category in database
exports.postCategory=async(req,res)=>{
    let category= new Category(req.body)
    Category.findOne({category_name:category.category_name},async(error,data)=>{
        if(data==null){
            category= await category.save()
    if(!category){
        return res.status(400).json({error:'something went wrong'})
    }
    res.json({category})

        }
        else{
            return res.status(400).json({error:'Category must be unique'})
        }
    })
    
}

//to show all category
exports.showCategoryList=async(req,res)=>{
    const category=await Category.find()
    if(!category){
        return res.satatus(400).json({error:'something went wrong'})
    }
    res.json({category})
}

//to show category details
exports.categoryDetails=async(req,res)=>{
    const category=await Category.findById(req.params.id)

    if(!category){
        return res.satatus(400).json({error:'something went wrong'})
}
res.json({category})
}


//to update category
exports.updateCategory=async(req,res)=>{
    const category=await Category.findByIdAndUpdate(
        req.params.id,
        {
            category_name:req.body.category_name
        },
        {new:true}
    )
    if(!category){
        return res.satatus(400).json({error:'something went wrong'})
}
res.json({category})

}

// to delete category
exports.deleteCategory=(req,res)=>{
    Category.findByIdAndRemove(req.params.id).then(category=>{
        if(!category){
            return res.status(403).json({error:"category not found"})
        }
        else{
            return res.status(200).json({message:"Category Deleted"})
        }
    })
    .catch(err=>{
        return res.status(400).json({error:err})
    })
}