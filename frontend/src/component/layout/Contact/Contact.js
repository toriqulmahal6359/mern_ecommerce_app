import React from "react";
import "./Contact.css";
import { Button } from "@material-ui/core";

const Contact = () => {
  return (
    <div className="contactContainer">
      <a className="mailBtn" href="mailto:toriqulmahal6359@yahoo.com">
        <Button>Contact: toriqulmahal6359@yahoo.com</Button>
      </a>
    </div>
  );
};

export default Contact;
