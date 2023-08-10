import "./HeroCard.css";
import React from 'react'
import Carousel from 'react-material-ui-carousel';
import { Link, Paper } from '@material-ui/core';
import { CgMouse } from "react-icons/cg";
import { IoMdPaperPlane } from "react-icons/io";

const HeroCard = ({ products }) => {
  return (
    <div className='game-carousel-container'>
        <Carousel>
            {  products?.map((product) => (
                <Paper>
                    <div className='game-card-container'>
                    <div className='game-card' style={{"--img": `url(${product.images[0].url})`}}>
                        <div className='game-detail'>
                            <div className='game-image'>
                                <img src={product.images[0].url} alt={product.name} />
                            </div>
                            <div className="game-platform">
                                <h4>Available for {product.category} now</h4>
                                <div className="explore-buttons">
                                    <a href='#container'>
                                        <button>Scroll <CgMouse /></button>
                                    </a>
                                    <a href="/products">
                                        <button>Explore <IoMdPaperPlane /></button>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                    </div>
                </Paper>
            ))}
        </Carousel>
    </div>
  )
}

export default HeroCard