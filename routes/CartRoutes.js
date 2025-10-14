import express from 'express';
import { addtoCart,CheckoutCart, getCartItems, getSellerEarnings, removeCartItem } from '../controller/CartController.js';
import { verifyToken } from '../middleware/verifyToken.js';
const router=express.Router();

router.post('/add-to-cart/:id',verifyToken,addtoCart);
router.get('/get-cart-items',verifyToken,getCartItems);
router.post('/remove-from-cart',verifyToken,removeCartItem);
router.post('/checkout',verifyToken,CheckoutCart)
router.get("/earning/my-earning",verifyToken,getSellerEarnings);


export default router;
