import React, { Fragment, useEffect } from 'react';
import { CgMouse } from "react-icons/cg";
import ProductCard from './ProductCard';
import "./Home.css";
import MetaData from '../layout/MetaData';
import { clearErrors, getproduct } from '../../actions/productAction';
import { useSelector, useDispatch } from 'react-redux';
import Loader from '../layout/Loader/Loader';
import { useAlert } from 'react-alert';


const product = {
    name: "Grand Theft Auto V",
    images: [{ url: "https://m.media-amazon.com/images/W/WEBP_402378-T2/images/I/51MFu2e82VL.jpg" }],
    price: "500$",
    _id: "mahal",
}

const Home = () => {
  const alert = useAlert();
  const dispatch = useDispatch();
  const { loading, error, recentProducts, featuredProducts, productsCount } = useSelector((state) => state.products);
  
  useEffect(() => {
    if(error){
      alert.error(error);
      dispatch(clearErrors());
    }
    dispatch(getproduct());
  }, [dispatch, error, alert]) 

  return (
    <Fragment>
      {loading ? (<Loader />) : 
        (
          <Fragment>
            <MetaData title="Ecommerce Site Project" />
            <div className='banner'>
                <p>Welcome To Ecommerce</p>
                <h1>Find Amazing Products Below</h1>
    
                
                <a href='#container'>
                    <button>
                        Scroll <CgMouse />
                    </button>
                </a>
            </div>
            <h2 className='homeHeading'>Recently Added</h2>
              <div className='container' id='container'>
                { recentProducts && recentProducts.map((product) => (
                      <ProductCard product={product} />
                ))}
              </div>
            <h2 className='homeHeading'>Featured Products</h2>
              <div className='container' id='container'>
                { featuredProducts && featuredProducts.map((product) => (
                      <ProductCard product={product} />
                ))}
              </div>
          </Fragment>
        )
      }
    </Fragment>
   
  )
}

export default Home