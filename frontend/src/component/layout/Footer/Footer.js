import React, { Fragment } from 'react'
import "./Footer.css"
import playStore from "../../../images/playStore.png"; 
import appStore from "../../../images/appStore.png";
import { CgFacebook, CgInstagram, CgYoutube } from 'react-icons/cg';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  return (
    <footer id="footer">
        <div className="leftFooter">
            <h4>Download Our App</h4>
            <p>Download App For iOS and Android Phone</p><br />
            <div>
              <img src={playStore} alt='playStore'></img>
              <img src={appStore} alt='appStore'></img>
            </div>
        </div>
        <div className="midFooter">
            <h1>GAMESHOP</h1><br />
            <h1>ECOMMERCE</h1><br /><br /><br />
            <span>High Quality is Our First Priority</span>

            <p>Copyright {currentYear} &copy; at <strong>Md.Toriqul Islam Khan Mahal</strong>.<br />All Rights Reserved</p>
        </div>
        <div className="rightFooter">
            <h4>Follow Us</h4>
            <div>
              <a href='javascript:void(0)'><CgFacebook /></a>
              <a href='javascript:void(0)'><CgYoutube /></a>
              <a href='javascript:void(0)'><CgInstagram /></a>
            </div>
        </div>
    </footer>
  )
}

export default Footer