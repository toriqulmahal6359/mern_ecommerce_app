import React, { Fragment, useEffect, useState } from 'react'
import "./Products.css"
import { useSelector, useDispatch } from 'react-redux'
import { clearErrors, getproduct } from '../../actions/productAction'
import Loader from '../layout/Loader/Loader'
import ProductCard from '../Home/ProductCard'
import { useParams } from 'react-router-dom'
import Pagination from "react-js-pagination"
import Slider from "@material-ui/core/Slider"
import Typography from '@material-ui/core/Typography'

const Products = () => {

    const dispatch = useDispatch();
    const { keyword } = useParams();
    const [ currentPage, setCurrentPage ] = useState(1);
    const [ price, setPrice ] = useState([0, 25000]);

    const { loading, error, products, productsCount, resultsPerPage } = useSelector((state) => state.products);

    const setCurrentPageNo = (e) => {
        setCurrentPage(e);
    }

    const priceHandler = (event, price) => {
        setPrice(price);
    }

    useEffect(() => {
      dispatch(getproduct(keyword, currentPage, price));
    }, [dispatch, keyword, currentPage, price])
    
  return (
    <Fragment>
        { loading ? (
            <Loader />
        ) : (
            <Fragment>
                <h2 className='productsHeading'>Products</h2>
                <div className="products">
                    { products && products.map(product => (
                        <ProductCard key={product.id} product={product}/>
                    ))}
                </div>
                <div className='filterBox'>
                    <Typography>Price</Typography>

                        <Slider 
                          value={price}
                          onChange={priceHandler}
                          valueLabelDisplay="auto"
                          aria-labelledby="range-slider"
                          min={0}
                          max={25000}
                        />
                        
                </div>
                { resultsPerPage < productsCount && (
                    <div className='paginationBox'>
                        <Pagination
                            activePage={currentPage}
                            itemsCountPerPage={resultsPerPage}
                            totalItemsCount={productsCount}
                            onChange={setCurrentPageNo}
                            nextPageText="Next"
                            prevPageText="Prev"
                            firstPageText="First"
                            lastPageText="Last"
                            itemClass='page-item'
                            linkClass='page-link'
                            activeClass='pageItemActive'
                            activeLinkClass='pageLinkActive'
                        />
                    </div>
                )}
                
            </Fragment>
        )}
    </Fragment>
  )
}

export default Products