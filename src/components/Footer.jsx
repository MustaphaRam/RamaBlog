import React from "react";
import Logo from "../img/logo.png";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer>
      <img src={Logo} alt="" />
      <span>
        { new Date().getFullYear() } Created By <Link to="https://github.com/MustaphaRam" target="_blank" ><span ><b>Mustaphie</b></span></Link> ♥️, All Right Reserved.
      </span>
    </footer>
  );
};

export default Footer;
