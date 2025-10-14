import mongoose from "mongoose";

const cartSchema=new mongoose.Schema({
    userid:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    productId:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"Template",
            required:true
        },
    ]
})
export const CartModel=mongoose.model("cart",cartSchema);