const mongoose=require('mongoose')
mongoose.connect(process.env.DATABASE,{
    useNEWUrlParser:true,
    useUnifiedTopology:true

})

.then(()=>console.log('databse connected'))
.catch(err=>console.log(err))