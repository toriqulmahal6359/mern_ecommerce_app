import React, { Fragment, useEffect } from 'react';
import "./payment.css"
import MetaData from "../layout/MetaData";
import CheckoutSteps from "../Cart/CheckoutSteps";
import PaymentIcon from '@material-ui/icons/Payment';
import { useSelector, useDispatch } from 'react-redux';
import { createOrder, clearErrors } from "../../actions/orderAction";
import Loader from "../layout/Loader/Loader";
// import { useLocation, useNavigate } from 'react-router-dom';
import { useAlert } from 'react-alert';


const Payment = ({ payment }) => {
  const dispatch = useDispatch();
  const alert = useAlert();
  // const navigate = useNavigate();
  // const location = useLocation();

  const orderInfo = JSON.parse(sessionStorage.getItem("orderInfo"));
  
  const { shippingInfo, cartItems } = useSelector((state) => state.cart);
  const { loading } = useSelector((state) => state.user);
  const { error } = useSelector((state) => state.newOrder);

  const orderItems = cartItems.map((item) => {
      return {
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        image: item.image,
        product: item.product,
      };
  });

  const handlePayment = async () => {
    const order = {
      shippingInfo,
      orderItems,
      itemsPrice: orderInfo.subtotal,
      taxPrice: orderInfo.taxPrice,
      shippingPrice: orderInfo.shippingPrice,
      totalPrice: orderInfo.totalPrice,
    }
    console.log(order);
    dispatch(createOrder(order));
  };

  useEffect(() => {
    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }
  }, [dispatch, error, alert]);
  

  return (
    <div>
      { loading ? ( <Loader /> ) : (
        <Fragment>
          <MetaData title="Payment" />
          <CheckoutSteps activeStep={2} />
          <div className="paymentContainer">
            <PaymentIcon />
            <button onClick={handlePayment} disabled={loading} className='paymentBtn'>
                Pay with SSLCommerz
            </button>
          </div>
        </Fragment>
      )}
    </div>
  );
};

export default Payment;