import React, { Fragment, useState, useEffect } from 'react'
import Carousel from "react-material-ui-carousel"
import "./ProductDetails.css"
import MetaData from "../layout/MetaData"
import { useSelector, useDispatch } from "react-redux"
import { clearErrors, getproductDetails } from '../../actions/productAction'
import { useParams } from 'react-router-dom'
import ReactStars from 'react-rating-stars-component'
import ReviewCard from "./ReviewCard.js"
import Loader from "../layout/Loader/Loader"
import { useAlert } from "react-alert"
import { addItemsToCart } from '../../actions/cartAction'

const ProductDetails = ({ match }) => {

  const alert = useAlert();
  const dispatch = useDispatch();
  const { id } = useParams();
  const { loading, error, product } = useSelector((state) => state.productDetails);

  const [quantity, setQuantity] = useState(1);

  const decreaseQuantity = () => {
    if(quantity <= 1) return;
    const qty = quantity - 1;
    setQuantity(qty);
  }

  const increaseQuantity = () => {
    if(product.stock <= quantity) return;
    const qty = quantity + 1;
    setQuantity(qty);
  }

  const addToCartHandler = () => {
    dispatch(addItemsToCart(id, quantity));
    alert.success("Item added To Cart");
  }

  useEffect(() => {
    if(error){
      alert.error(error);
      dispatch(clearErrors());
    }
    dispatch(getproductDetails(id));
  }, [dispatch, id, error, alert]);

  const options = {
    edit: false,
    color: "rgba(20,20,20,0.1)",
    activeColor: "tomato",
    value: product.ratings,
    isHalf: true,
    size: window.innerWidth < 600 ? 20 : 25
  }
  
  return (
    <Fragment>
      { loading ? (
      <Loader />
      ) : (
        <Fragment>
           <MetaData title={`${product.name} --Ecommerce`}/>
          <div className='productDetails'>
            <div>
                <Carousel>
                  { product.images && product.images.map((item, i) => (
                    <img className='CarouselImg' key={item.url} src={item.url} alt={`${i} Slide`}/>
                  ))}
                </Carousel>
            </div>
            <div>
              <div className='detailsBlock-1'>
                  <h2>{product.name}</h2>
                  <p>Product # {product._id}</p>
              </div>
              <div className='detailsBlock-2'>
                  <ReactStars {...options} />
                  <span> ({product.numOfReviews} Reviews) </span>
              </div>
              <div className='detailsBlock-3'>
                  <h1>{`${product.price} ৳`}</h1>
                  <div className='detailsBlock-3-1'>
                    <div className='detailsBlock-3-1-1'>
                        <button onClick={decreaseQuantity}>-</button>
                        <input readOnly type="number" value={quantity} />
                        <button onClick={increaseQuantity}>+</button>
                    </div>{" "}
                    <button onClick={addToCartHandler}>Add To Cart</button>
                  </div>
                  <p>Status : {" "} 
                    <b className={product.Stock < 1 ? "redColor" : "greenColor"}>
                      { product.Stock < 1 ? "OutOfStock" : "InStock" }
                    </b>
                  </p>
              </div>
              <div className='detailsBlock-4'>
                Description: <p>{product.description}</p>
              </div> 
              <button className='submitReview'>Submit Review</button>
            </div>
          </div>
          <h3 className='reviewsHeading'>Reviews</h3>
          { product.reviews && product.reviews[0] ? (
            <div className="review">
              { product.reviews && product.reviews.map((review) => <ReviewCard review={review} />)}
            </div>
          ) : (
            <p className='noReviews'>No Reviews yet</p>
          )}
        </Fragment>
      )}
    </Fragment>
    
  )
}

export default ProductDetails