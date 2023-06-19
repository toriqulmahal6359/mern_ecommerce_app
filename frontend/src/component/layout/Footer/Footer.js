import React from 'react'
import "./Footer.css"
import playStore from "../../../images/playStore.png"; 
import appStore from "../../../images/appStore.png"; 

const Footer = () => {
  const currentYear = new Date().getFullYear();
  return (
    <footer id="footer">
        <div className="leftFooter">
            <h4>Download Our App</h4>
            <p>Download App For iOS and Android Phone</p><br />
            <img src={playStore} alt='playStore'></img>
            <img src={appStore} alt='appStore'></img>
        </div>
        <div className="midFooter">
            <h1>ECOMMERCE</h1>
            <span>High Quality is Our First Priority</span>

            <p>Copyright {currentYear} &copy; at <strong>Md.Toriqul Islam Khan Mahal</strong>.<br />All Rights Reserved</p>
        </div>
        <div className="rightFooter">
            <h4>Follow Us</h4>
            <a href='javascript:void(0)'>Facebook</a>
            <a href='javascript:void(0)'>Youtube</a>
            <a href='javascript:void(0)'>Instagram</a>
        </div>
    </footer>
  )
}

export default Footer