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
import OrderSuccess from "./component/Cart/OrderSuccess";
import MyOrders from "./component/Order/MyOrders";
import OrderDetails from "./component/Order/OrderDetails";
import Dashboard from "./component/Admin/Dashboard.js";
import ProductList from "./component/Admin/ProductList.js";
import NewProduct from "./component/Admin/NewProduct";
import UpdateProduct from "./component/Admin/UpdateProduct";
import OrderList from "./component/Admin/OrderList";
import ProcessOrder from "./component/Admin/ProcessOrder";
import UsersList from "./component/Admin/UsersList";
import UpdateUser from "./component/Admin/UpdateUser";
import ProductReviews from "./component/Admin/ProductReviews";
import Contact from "./component/layout/Contact/Contact";
import About from "./component/layout/About/About";
import NotFound from "./component/layout/Not Found/NotFound";


function App() {

  const { isAuthenticated, user } = useSelector((state) => state.user);

  // const [ storeId, setStoreId ] = useState("");

  // async function getStoreId (){
  //   const { data } = await axios.get("api/v1/storeId");
  //   setStoreId(data.storeId);
  // }

  useEffect(() => {
    WebFont.load({
      google: {
        families: ['Roboto', 'Droid Sans', 'Chilanka']
      }
    })
  
    store.dispatch(loadUser());
    // getStoreId();
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
            <Route exact path='/search' element={<Search />} />   
            <Route exact path='/contact' element={<Contact />} />   
            <Route exact path='/about' element={<About />} /> 
            <Route path='/account' element={<ProtectedRoute component={Profile} />} />  
            <Route path='/me/update' element={<ProtectedRoute component={UpdateProfile} />} />
            <Route path='/password/update' element={ <ProtectedRoute component={UpdatePassword} />} />
            <Route exact path='/password/forgot' element={<ForgotPassword />} />
            <Route exact path='/password/reset/:token' element={<ResetPassword />} />
            <Route exact path='/login' element={<LoginSignUp />}/>
            <Route path='/cart' element={<Cart />} />
            <Route path='/shipping' element={<ProtectedRoute component={Shipping} />} />
            <Route path='/order/success/:tran_id' element={<OrderSuccess />} />
            <Route path='/orders' element={<ProtectedRoute component={MyOrders} />} />
            <Route path='/order/confirm' element={<ProtectedRoute component={ConfirmOrder} />} />
            <Route path='/order/:id' element={<ProtectedRoute component={OrderDetails} />} />
            
            <Route exact path="/admin/dashboard" element={<ProtectedRoute component={Dashboard} isAdmin={ true }/>} />
            <Route exact path="/admin/products" element={<ProtectedRoute component={ProductList} isAdmin={ true } />} />
            <Route exact path="/admin/product" element={<ProtectedRoute component={NewProduct} isAdmin={ true } />} />
            <Route exact path="/admin/product/:id" element={<ProtectedRoute component={UpdateProduct} isAdmin={ true } />} />
            <Route exact path="/admin/orders" element={<ProtectedRoute component={OrderList} isAdmin={ true } />} />
            <Route exact path="/admin/order/:id" element={<ProtectedRoute component={ProcessOrder} isAdmin={ true } />} />
            <Route exact path="/admin/users" element={<ProtectedRoute component={UsersList} isAdmin={ true } />} />
            <Route exact path="/admin/user/:id" element={<ProtectedRoute component={UpdateUser} isAdmin={ true } />} />
            <Route exact path="/admin/reviews" element={<ProtectedRoute component={ProductReviews} isAdmin={ true } />} />
            
            {/* <Route path="/payment/confirm" element={window.location.pathname === '/payment/confirm' ? (<ProtectedRoute component={Payment} />): ( <NotFound /> )}/> */}
            <Route path='/payment/confirm' element={<ProtectedRoute component={Payment} />} />
          </Routes>
          
        <Footer />
    </Router>

  );
}

export default App;
