import React, { Fragment, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import "./Search.css"

const Search = () => {
    const [keyword, setKeyword] = useState('');
    const navigate = useNavigate();
    const searchSubmitHandler = (e) => {
        e.preventDefault();
        if(keyword.trim()){
            navigate(`/products/${keyword}`);
        }else{
            navigate("/");
        }
    }
  return (
    <Fragment>
        <form className='searchBox' onSubmit={searchSubmitHandler}>
            <input type="text" placeholder='Search a Product.....' onChange={(e)=> setKeyword(e.target.value) }/>
            <input type='submit' value='Search'></input>
        </form>
        
    </Fragment>
  )
}

export default Search