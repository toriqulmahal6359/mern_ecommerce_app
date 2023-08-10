import React, { Fragment, useState, useEffect } from 'react'
import Carousel from "react-material-ui-carousel"
import "./ProductDetails.css"
import MetaData from "../layout/MetaData"
import { useSelector, useDispatch } from "react-redux"
import { clearErrors, getproductDetails, newReview } from '../../actions/productAction'
import { useParams } from 'react-router-dom'
import ReactStars from 'react-rating-stars-component'
import ReviewCard from "./ReviewCard.js"
import ProductCard from "../Home/ProductCard"
import Loader from "../layout/Loader/Loader"
import { useAlert } from "react-alert"
import { addItemsToCart } from '../../actions/cartAction'
import { Dialog, DialogActions, DialogContent, DialogTitle, Button } from '@material-ui/core'
import { Rating } from "@material-ui/lab";
import { NEW_REVIEW_RESET } from '../../constants/productConstants'

const ProductDetails = ({ match }) => {

  const alert = useAlert();
  const dispatch = useDispatch();
  const { id } = useParams();

  const { loading, error, product, relatedProducts } = useSelector((state) => state.productDetails);
  const { success, error: reviewError } = useSelector((state) => state.newReview);

  const options = {
    size: "large",
    value: product.ratings,
    readOnly: true,
    precision: 0.5
  }

  const [quantity, setQuantity] = useState(1);
  const [open, setOpen] = useState(false);
  const [video, setVideo] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

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

  const submitReviewToggle = () => {
    open ? setOpen(false) : setOpen(true);
  }

  const submitTrailerToggle = () => {
    video ? setVideo(false) : setVideo(true);
  }

  const reviewSubmitHandler = () => {
    const myForm = new FormData();

    myForm.set("rating", rating);
    myForm.set("comment", comment);
    myForm.set("productId", id);

    dispatch(newReview(myForm));
    setOpen(false);
  }

  useEffect(() => {

    if(error){
      alert.error(error);
      dispatch(clearErrors());
    }

    if(reviewError){
      alert.error(reviewError);
      dispatch(clearErrors());
    }

    if(success){
      alert.success("Review Submitted Successfully");
      dispatch({ type: NEW_REVIEW_RESET });
    }

    dispatch(getproductDetails(id));
  }, [dispatch, id, error, alert, reviewError, success]);

  // const options = {
  //   edit: false,
  //   color: "rgba(20,20,20,0.1)",
  //   activeColor: "tomato",
  //   value: product.ratings,
  //   isHalf: true,
  //   size: window.innerWidth < 600 ? 20 : 25
  // }
  

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
                    <button disabled={ product.stock < 1 ? true : false } onClick={addToCartHandler}>Add To Cart</button> 
                  </div>
                  <p>Status : {" "} 
                    <b className={product.stock < 1 ? "redColor" : "greenColor"}>
                      { product.stock < 1 ? "OutOfStock" : "InStock" }
                    </b>
                  </p>
              </div>
              <div className='detailsBlock-4'>
                Description: <p>{product.description}</p>
              </div> 
              <div className="featureButton">
                <button onClick={submitReviewToggle} className='submitReview'>Submit Review</button>
                {
                  product && product.trailer !== undefined ? (
                    <button onClick={submitTrailerToggle} className='submitTrailer'>Watch Trailer</button>
                  ) : null
                }
              </div>
              <div id="trailerVid">
                <Dialog maxWidth="lg" aria-labelledby="simple-dialog-trailer" open={video} onClose={submitTrailerToggle}>
                    <DialogContent className="submitDialog">
                      <iframe width="1120" height="540" src={product.trailer} title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
                    </DialogContent>
                </Dialog>
              </div>
              
            </div>
          </div>
          <h2 className='relatedProductsHeading'>Related Products</h2>
          <div className="container">
              { relatedProducts && relatedProducts.map(product => (
                  <ProductCard key={product._id} product={product} />
              ))}
          </div>

          <h3 className='reviewsHeading'>Reviews</h3>
          <Dialog aria-labelledby="simple-dialog-title" open={open} onClose={submitReviewToggle}>
              <DialogTitle>Submit Review</DialogTitle>
              <DialogContent className="submitDialog">
                <Rating onChange={(e) => setRating(e.target.value)} value={rating} size='large' />
                <textarea className="submitDialogTextArea" cols="30" rows="5" value={comment} onChange={(e) => setComment(e.target.value)}></textarea>
              </DialogContent>
              <DialogActions>
                <Button onClick={submitReviewToggle} color='secondary'>Cancel</Button>
                <Button onClick={reviewSubmitHandler} color='primary'>Submit</Button>
              </DialogActions>
          </Dialog>
          { product.reviews && product.reviews[0] ? (
            <div className="review">
              { product.reviews && product.reviews.map((review) => <ReviewCard key={review._id} review={review} />)}
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