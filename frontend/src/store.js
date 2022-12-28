import { createStore, combineReducers, applyMiddleware } from "redux"

import thunk from "redux-thunk"
import { composeWithDevTools } from "redux-devtools-extension"
import { productDetailsReducers, productReducers } from "./reducers/productReducer";

const reducer = combineReducers({
    products: productReducers,
    productDetails: productDetailsReducers
});

let initialStates = {};

const middleware = [thunk];

const store = createStore(reducer, initialStates, composeWithDevTools(applyMiddleware(...middleware)));

export default store;


