const orderItem = require('../model/order-item')
const OrderItem=require('../model/order-item')
const Order=require('../model/orderModel')

exports.postOrder=async(req,res)=>{
    const OrderItemIds=Promise.all(req.body.orderItems.map(async(orderItem)=>{
        let newOrderItem= new OrderItem({
            quantity:orderItem.quantity,
            product:orderItem.product
        })
        newOrderItem= await newOrderItem.save()
        return newOrderItem._id
    }))
    const orderItemIdResolved= await OrderItemIds

    const totalPrices=await Promise.all(orderItemIdResolved.map(async(orderId)=>{
        const itemOrder=await OrderItem.findById(orderId).populate('product','product_price')
        const total = itemOrder.quantity * itemOrder.product.product_price
        return total
    }))
    const TotalPrice = totalPrices.reduce((a,b)=>a+b,0) 

    let order= new Order({
        orderItems:orderItemIdResolved,
        shippingAddress1:req.body.shippingAddress1,
        shippingAddress2:req.body.shippingAddress2,
        city:req.body.city,
        zip:req.body.zip,
        country:req.body.country,
        phone:req.body.phone,
        totalPrice:TotalPrice,
        user:req.body.user
    })
    order = await order.save()
    if(!order){
        return res.status(400).json({error:"something went wrong"})
    }
    res.send(order)

}

//order list

exports.orderList=async(req,res)=>{
    const order= await Order.find()
    .populate('user','name')
    .sort({dateOrdered:-1})
    if(!order){
        return res.status(400).json({error:"something went wrong"})
    }
    res.send(order)

}

//order details
exports.orderDetails=async(req,res)=>{
    const order = await Order.findById(req.params.id)
    .populate('user','name')
    .populate({
        path:'orderItems',populate:{
            path:'product',populate:'category'
        }
    })
    if(!order){
        return res.status(400).json({error:"something went wrong"})
    }
    res.send(order)
}

//update status
exports.updateStatus=async(req,res)=>{
    const order= await Order.findByIdAndUpdate(
        req.params.id,
        {
            status:req.body.status
        },
        {new:true}
    )
    if(!order){
        return res.status(400).json({error:"something went wrong"})
    }
    res.send(order)

}

//user orders
exports.userOrders=async(req,res)=>{
    const userOrderList=await Order.find({user:req.params.userid})
    .populate({
        path:'orderItems',populate:{
            path:'product',populate:'category'
        }
    })
    .sort({dateOrdered:-1})

    if(!userOrderList){
        return res.status(400).json({error:'something went wrong'})
    }
    res.send(userOrderList)
}
//order delete
exports.deleteOrder=(req,res)=>{
    Order.findByIdAndRemove(req.params.id).then( async order => {
        if(order){
            await order.orderItems.map(async orderItem => {
                await OrderItem.findByIdAndRemove(orderItem)
            })
            return res.json({message:"the order has been deleted"})
        }
        else{
            return res.json({error:'failed to delete order'})
        }
    })
    .catch(err => {
        return res.status(400).json({error:err})
    })
}
