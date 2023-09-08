import React from "react";
import "./aboutSection.css";
import { Button, Typography, Avatar } from "@material-ui/core";
import YouTubeIcon from "@material-ui/icons/YouTube";
import InstagramIcon from "@material-ui/icons/Instagram";

const About = () => {
  const visitInstagram = () => {
    window.location = "https://www.facebook.com/toriqul.mahal.56236/";
  };
  return (
    <div className="aboutSection">
      <div></div>
      <div className="aboutSectionGradient"></div>
      <div className="aboutSectionContainer">
        <Typography component="h1">About Myself</Typography>
        <div>
          <div>
            <Avatar
              style={{ width: "10vmax", height: "10vmax", margin: "2vmax 0" }}
              src="https://res.cloudinary.com/dt95c6ptb/image/upload/v1684771985/myself/02_c5frfz.jpg"
              alt="Creator"
            />
            <Typography>Md. Toriqul Islam Khan Mahal</Typography>
            <Button onClick={visitInstagram} color="primary">
              Visit Profile
            </Button>
            <span>
              This is a simple E-commerce wesbite made by myself, Md. Toriqul Islam Khan Mahal. The purpose of 
              making this website to be showcased as my final year graduation project. 
            </span>
          </div>
          <div className="aboutSectionContainer2">
            <Typography component="h2">Our Brands</Typography>
            <a href="https://www.youtube.com" target="blank">
              <YouTubeIcon className="youtubeSvgIcon" />
            </a>
            <a href="https://instagram.com" target="blank">
              <InstagramIcon className="instagramSvgIcon" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
