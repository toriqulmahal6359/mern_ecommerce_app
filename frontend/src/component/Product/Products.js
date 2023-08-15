import React, { Fragment, useEffect, useState } from 'react'
import "./Products.css"
import MetaData from "../layout/MetaData"
import { useSelector, useDispatch } from 'react-redux'
import { clearErrors, getproduct } from '../../actions/productAction'
import Loader from '../layout/Loader/Loader'
import ProductCard from '../Home/ProductCard'
import { useParams } from 'react-router-dom'
import Pagination from "react-js-pagination"
import Slider from "@material-ui/core/Slider"
import Typography from '@material-ui/core/Typography'
import { useAlert } from "react-alert";

const categories = [
    'PC', 'XBOX 360', 'Playstation 4', 'XBOX One', 'Playstation 5', 'Nintendo', 'PSP', 'Playstation 3', 'Nintendo DS', 'Wii'
];

const availableGenres = [
    'First-Person', 'Third-person', 'Arcade', 'Shooting', 
    'Racing', 'Sports', 'Spy', 'Military', 'Sci-Fi', 'Mystery', 'Horror', 'Adventure',
    'Open-World', 'Puzzle', 'Action', 'Fighting', 'Ancient', 'Survival', 'Simulation', 'Fantasy'  
];

const Products = () => {

    const dispatch = useDispatch();
    const { keyword } = useParams();
    const alert = useAlert();

    const [ currentPage, setCurrentPage ] = useState(1);
    const [ price, setPrice ] = useState([0, 25000]);
    const [ category, setCategory ] = useState("");
    const [ selectedGenres, setSelectedGenres ] = useState([]);

    const [ ratings, setRatings ] = useState(0);

    const { loading, error, products, productsCount, resultPerPage, filteredProductsCount } = useSelector((state) => state.products);

    const setCurrentPageNo = (e) => {
        setCurrentPage(e);
    }

    const priceHandler = (e, data) => {
        setPrice(data)
    }

    const handleGenreSelect = (genre) => {
        if(selectedGenres.includes(genre)){
            setSelectedGenres(selectedGenres.filter((g) => g !== genre))
        }else{
            setSelectedGenres([...selectedGenres, genre])
        }
    }
    
    useEffect(() => {
        if(error){
            alert.error(error);
            dispatch(clearErrors());
        }
      dispatch(getproduct(keyword, currentPage, price, category, ratings, selectedGenres));
    }, [dispatch, keyword, currentPage, price, category, ratings, selectedGenres, alert, error])

    let count = filteredProductsCount;
    
  return (
    <Fragment>
        { loading ? (
            <Loader />
        ) : (
            <Fragment>
                <MetaData title='Products --Ecommerce'/>
                <h2 className='productsHeading'>Products</h2>
                <div className="products">
                    { products && products.map(product => (
                        <ProductCard key={product.id} product={product}/>
                    ))}
                </div>
                { keyword && <div className='filterBox'>
                    <Typography>Price</Typography>
                    <Slider 
                        value={price}
                        onChange={priceHandler}
                        aria-labelledby="range-slider"
                        valueLabelDisplay='auto'
                        min={0}
                        max={25000}
                    ></Slider>

                    <Typography>Categories</Typography>
                    <ul className='categoryBox'>
                        {categories.map((category) => (
                            <li className="category-link" key={category} onClick={()=> setCategory(category)}>{category}</li>
                        ))}
                    </ul>

                    <Typography>Genres</Typography>
                    <ul className='categoryBox'>
                        {availableGenres.map((genre, index) => (
                            <li className="category-link" key={genre}>
                                <label>
                                <input type='checkbox' value={genre} checked={selectedGenres.includes(genre)} onChange={() => handleGenreSelect(genre)} />&nbsp;&nbsp;{genre}
                                </label>
                            </li>
                        ))}
                    </ul>
                    
                    <fieldset>
                        <Typography component='legend'>Ratings Above</Typography>
                        <Slider 
                            value= {ratings}
                            onChange= {(e, newRatings) => { setRatings(newRatings) }}
                            aria-labelledby = "continuous-slider"
                            min= {0}
                            max= {5}
                            valueLabelDisplay= 'auto'
                        ></Slider>
                    </fieldset>    
                </div>}
                
                { resultPerPage < count && (
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