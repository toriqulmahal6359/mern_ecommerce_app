import React from "react";
import "./Contact.css";
import { Button } from "@material-ui/core";

const Contact = () => {
  return (
    <div className="contactContainer">
      <a className="mailBtn" href="mailto:toriqulmahal6359@yahoo.com">
        <Button>Email Address: toriqulmahal6359@yahoo.com</Button>
      </a>
      <a className="mailBtn" href="callto:+8801679193287">
        <Button>Phone Number 1: +8801679193287</Button>
      </a>
      <a className="mailBtn" href="callto:+8801911251805">
        <Button>Phone Number 2: +8801911251805</Button>
      </a>
      <a className="mailBtn" href="callto:+8801875213372">
        <Button>Phone Number 3: +8801875213372</Button>
      </a>
    </div>
  );
};

export default Contact;
