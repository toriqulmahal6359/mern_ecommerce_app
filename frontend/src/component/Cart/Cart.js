import React, { Fragment } from 'react';
import "./cart.css";
import { useSelector, useDispatch } from "react-redux";
import CartItemCard from "./CartItemCard"
import { addItemsToCart, removeItemsFromCart } from '../../actions/cartAction';
import { Link, Navigate } from 'react-router-dom';
import { Typography } from "@material-ui/core";
import RemoveShoppingCartIcon from "@material-ui/icons/RemoveShoppingCart";
import { useNavigate } from 'react-router-dom';

const Cart = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { cartItems } = useSelector((state) => state.cart)

    const increaseQuantity = (id, quantity, stock) => {
        const newQty = quantity + 1;
        if(stock <= quantity){
            return ;
        }
        dispatch(addItemsToCart(id, newQty));
    }

    const decreaseQuantity = (id, quantity) => {
        const newQty = quantity - 1;
        if(quantity <= 1){
            return ;
        }
        dispatch(addItemsToCart(id, newQty));
    }

    const deleteCartItems = (id) => {
        dispatch(removeItemsFromCart(id));
    }

    const checkoutHandler = () => {
        navigate('/login?redirect=shipping');
    }

    const item = {
        product: 'product_id',
        price: 200,
        name: 'a sample product',
        quantity: 5,
        image: "https://m.media-amazon.com/images/W/WEBP_402378-T2/images/I/51MFu2e82VL.jpg"
    };

  return <Fragment>
    { cartItems.length === 0 ? (
        <div className='emptyCart'>
            <RemoveShoppingCartIcon />
            <Typography>No Product in your Cart</Typography>
            <Link to="/products">View Products</Link>
        </div>
        ) : (
        <Fragment>
        <div className="cartPage">
            <div className='cartHeader'>
                <p>Product</p>
                <p>Quantity</p>
                <p>Subtotal</p>
            </div>
            { cartItems && cartItems.map((item) => (
                <div className='cartContainer' key={item.product} >
                    <CartItemCard item={item} deleteCartItems={deleteCartItems} />
                    <div className='cartInput'>
                        <button onClick={(e) => decreaseQuantity(item.product, item.quantity)}>-</button>
                        <input type="number" value={item.quantity} readOnly />
                        <button onClick={(e) => increaseQuantity(item.product, item.quantity, item.stock)}>+</button>
                    </div>
                    <p className='cartSubTotal'>{`${item.price * item.quantity}৳`}</p>
                </div>
            ))}
            <div className='cartGrossProfit'>
                <div></div>
                <div className='cartGrossProfitBox'>
                    <p>Gross Total</p>
                    <p>{`${cartItems.reduce((acc, item) => acc + item.quantity * item.price, 0)}৳`}</p>
                </div>
                <div></div>
                <div className='checkOutbtn'>
                    <button onClick={(e) => checkoutHandler()}>Check Out</button>
                </div>
            </div>
        </div> 
    </Fragment>)}
  </Fragment>
  
}

export default Cart