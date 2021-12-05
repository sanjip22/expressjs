exports.productValidation=(req,res,next)=>{
    req.check('product_name','Product Name is required').notEmpty()
    req.check('product_price','Price is required').notEmpty()
    .isNumeric()
    .withMessage('Price only accepts numeric value')
    req.check('countInStock','Stock value is required').notEmpty()
    .isNumeric()
    .withMessage('Stock value only contains numeric characters')
    req.check('product_description','Product description is required').notEmpty()
    .isLength({
        min:20
    })
    .withMessage('Descripation must be more than 20 characters')
    req.check('category','Category is required').notEmpty()

    const errors=req.validationErrors()
    if(errors){
        const showError=errors.map(error=>error.msg)[0]
        return res.status(400).json({error:showError})
    }
    next()
}
