import { createStore, combineReducers, applyMiddleware } from "redux"

import thunk from "redux-thunk"
import { composeWithDevTools } from "redux-devtools-extension"
import { productDetailsReducers, productReducers } from "./reducers/productReducer";
import { userReducers, profileReducers, forgotPasswordReducers } from "./reducers/userReducers";
import { cartReducers } from "./reducers/cartReducer";

const reducer = combineReducers({
    products: productReducers,
    productDetails: productDetailsReducers,
    user: userReducers,
    profile: profileReducers,
    forgotPassword: forgotPasswordReducers,
    cart: cartReducers
});

let initialStates = {
    cart : {
        cartItems: localStorage.getItem("cartItems") ? JSON.parse(localStorage.getItem("cartItems")) : [],
    }
};

const middleware = [thunk];

const store = createStore(reducer, initialStates, composeWithDevTools(applyMiddleware(...middleware)));

export default store;


