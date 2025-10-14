import { CartModel } from "../models/CartModel.js";
import { templateData } from "../models/TemplateModel.js";
import {EarningModel} from "../models/EarninngModel.js"; 
import mongoose from "mongoose";

export const addtoCart = async (req, res) => {
  try {
    const user = req.user; 
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid product ID" });
    }
    const productExists = await templateData.findById(id);
    if (!productExists) {
      return res.status(404).json({ message: "Product not found" });
    }

    let cart = await CartModel.findOne({ userid: user });

    if (cart) {
   
      if (cart.productId.includes(id)) {
        return res.status(400).json({ message: "Product already in cart" });
      }
     
      cart.productId.push(id);
      await cart.save();
      return res.status(200).json({ message: "Product added to cart", cart });
    } else {
     
      const newCart = new CartModel({
        userid: user,
        productId: [id], 
      });

      await newCart.save();
      return res.status(200).json({ message: "Cart created and product added", cart: newCart });
    }
  } catch (error) {
    console.log("Error adding to cart:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};


export const getCartItems=async(req,res)=>{
    try {
        const user=req.user;
        const cartItems=await CartModel.find({userid:user}).populate('productId');
        
        if (cartItems) {
            res.status(200).json({cartItems})
        }
        else{
            res.status(400).json({message:"no items in cart"})
        }
    } catch (error) {
        console.log("error in the fetching cart items",error)
        res.status(500).json({message:"internal server error"})
  }
}

export const removeCartItem = async (req, res) => {
  try {
    const user = req.user;
    const { id } = req.body;

    const result = await CartModel.updateOne(
      { userid: user },
      { $pull: { productId: id } }
    );

    if (result.modifiedCount > 0) {
      return res.status(200).json({ message: "Item removed successfully" });
    } else {
      return res.status(404).json({ message: "Item not found in cart" });
    }
  } catch (error) {
    console.log("Error deleting cart item:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const CheckoutCart = async (req, res) => {
  try {
    const user = req.user;
    const cartItems = await CartModel.findOne({ userid: user });

    if (!cartItems || !cartItems.productId?.length) {
      return res.status(400).json({ success: false, message: "Cart is empty" });
    }

  
    const products = await templateData.find({ _id: { $in: cartItems.productId } });

  
    const sellerEarnings = {};
    products.forEach((product) => {
      if (!product.OwnerId) return; 

      if (!sellerEarnings[product.OwnerId]) {
        sellerEarnings[product.OwnerId] = 0;
      }
      sellerEarnings[product.OwnerId] += product.Price;
    });

    // Update or create earning for each seller
    await Promise.all(
      Object.entries(sellerEarnings).map(async ([sellerId, totalEarned]) => {
        await EarningModel.findOneAndUpdate(
          { sellerId }, // find seller's earning
          {
            $inc: { amount: totalEarned }, 
            $set: { lastUpdated: new Date() },
            $setOnInsert: { fromUser: user }, // set fromUser only on first insert
          },
          { upsert: true, new: true }
        );
      })
    );

    // Clear the cart
    await CartModel.deleteOne({ userid: user });

    const totalAmount = products.reduce((sum, product) => sum + product.Price, 0);
    res.status(200).json({
      success: true,
      message: "Checkout completed successfully",
      totalAmount,
    });
  } catch (error) {
    console.error("Error in CheckoutCart:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getSellerEarnings = async (req, res) => {
  try {
    const sellerId = req.user;

    const earning = await EarningModel.findOne({ sellerId });

    if (!earning) {
      return res.status(200).json({ success: true, totalEarning: 0 });
    }

    res.status(200).json({
      success: true,
      totalEarning: earning.amount,
      lastUpdated: earning.lastUpdated,
    });
  } catch (error) {
    console.error("Error fetching seller earnings:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

