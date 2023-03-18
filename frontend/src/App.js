import React, { useEffect, useState } from 'react';
import WebFont from "webfontloader";
import './App.css';
import Header from "./component/layout/Header/Header.js";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Footer from './component/layout/Footer/Footer';
import Home from "./component/Home/Home.js"
import ProductDetails from "./component/Product/ProductDetails.js"
import Products from "./component/Product/Products.js"
import Cart from "./component/Cart/Cart.js";
import Shipping from "./component/Cart/Shipping.js";
import Payment from "./component/Cart/Payment.js";
import ConfirmOrder from "./component/Cart/ConfirmOrder.js";
import Search from "./component/Product/Search.js"
import LoginSignUp from './component/User/LoginSignUp.js';
import Profile from "./component/User/Profile.js";
import UpdateProfile from "./component/User/UpdateProfile.js";
import UpdatePassword from "./component/User/UpdatePassword.js";
import ForgotPassword from "./component/User/ForgotPassword.js";
import ResetPassword from "./component/User/ResetPassword.js";
import store from "./store";
import { loadUser } from './actions/userAction';
import UserOptions from "./component/layout/Header/UserOptions.js";
import { useSelector } from 'react-redux';
import ProtectedRoute from './component/Route/ProtectedRoute';
import axios from 'axios';

function App() {

  const { isAuthenticated, user } = useSelector((state) => state.user);

  const [ storeId, setStoreId ] = useState("");

  async function getStoreId (){
    const { data } = await axios.get("api/v1/storeId");
    setStoreId(data.storeId);
  }

  useEffect(() => {
    WebFont.load({
      google: {
        families: ['Roboto', 'Droid Sans', 'Chilanka']
      }
    })
  
    store.dispatch(loadUser());
    
    getStoreId();
  }, []);

  return (
    <Router>
        <Header />
          { isAuthenticated && <UserOptions user={user} /> }
          <Routes>
            <Route exact path='/' element={<Home />} />
            <Route exact path='/product/:id' element={<ProductDetails />} />
            <Route exact path='/products' element={<Products />} />
            <Route path='/products/:keyword' element={<Products />} />
            <Route path='/cart' element={<Cart />} />
            <Route path='/shipping' element={<ProtectedRoute Component={Shipping} />} />
            {/* <Route path='/process/payment' element={<ProtectedRoute Component={Payment} />} /> */}
            <Route path='/order/confirm' element={<ProtectedRoute Component={ConfirmOrder} />} />
            <Route path='/account' element={<ProtectedRoute Component={Profile} />} />
            <Route path='/me/update' element={<ProtectedRoute Component={UpdateProfile} />} />
            <Route path='/password/update' element={ <ProtectedRoute Component={UpdatePassword} />} />
            <Route exact path='/search' element={<Search />} />       
            <Route exact path='/login' element={<LoginSignUp />}/>
            <Route exact path='/password/forgot' element={<ForgotPassword />} />
            <Route exact path='/password/reset/:token' element={<ResetPassword />} />
          </Routes>
          
        <Footer />
    </Router>

  );
}

export default App;
