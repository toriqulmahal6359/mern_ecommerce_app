import { createStore, combineReducers, applyMiddleware } from "redux"

import thunk from "redux-thunk"
import { composeWithDevTools } from "redux-devtools-extension"
import { newProductReducer, newReviewReducer, productDetailsReducers, productReducers, productReviewsReducer, reviewReducer } from "./reducers/productReducer";
import { userReducers, profileReducers, forgotPasswordReducers, allUsersReducer, userDetailsReducer } from "./reducers/userReducers";
import { allOrdersReducer, myOrdersReducer, newOrderReducer, orderDetailsReducer, orderReducer, } from './reducers/orderReducer';
import { cartReducers } from "./reducers/cartReducer";

const reducer = combineReducers({
    products: productReducers,
    productDetails: productDetailsReducers,
    user: userReducers,
    profile: profileReducers,
    forgotPassword: forgotPasswordReducers,
    cart: cartReducers,
    newOrder: newOrderReducer,
    myOrders: myOrdersReducer,
    orderDetails: orderDetailsReducer,
    newReview: newReviewReducer,
    newProduct: newProductReducer,
    product: productReducers,
    allOrders: allOrdersReducer,
    order: orderReducer,
    allUsers: allUsersReducer,
    userDetails: userDetailsReducer,
    productReviews: productReviewsReducer,
    review: reviewReducer,
});

let initialStates = {
    cart : {
        cartItems: localStorage.getItem("cartItems") ? JSON.parse(localStorage.getItem("cartItems")) : [],
    }
};

const middleware = [thunk];

const store = createStore(reducer, initialStates, composeWithDevTools(applyMiddleware(...middleware)));

export default store;


