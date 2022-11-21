const mongoose=require('mongoose');
const OrderSchema=new mongoose.Schema({
    Name:{type: String},
    email:{type: String},
    password:{type:String},
    orderItems:[],
    shippingAddress:{type:Object},
    orderAmount:{type:Number,require},
    OrderId:{type:String,require},
    transactionId:{type:String,require},
},{
    timestamps:true
})
module.exports=Order=mongoose.model("orders",OrderSchema);