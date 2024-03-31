const db = require("../db.js");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { validationResult } = require('express-validator');
const { query } = require("express");

// register
const register = async (req, res) => {
  
  // VALIDATION REQUEST
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  console.log(req.body.email);

  // CHECK EXISTING USER
  const q = "SELECT * FROM users WHERE email = ? OR username = ?";

  // SEND QUERY
  db.query(q, [req.body.email, req.body.username], (err, data) => {
    if (err) return res.status(500).json(err);
    if (data.length) return res.status(409).json("User already exists!");

    //HASH PASWORD USER
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(req.body.password, salt);

    // INSERT NEW USER IN DB
    const q = "INSERT INTO users(`username`,`email`,`password`) VALUES (?)";
    const values = [req.body.username, req.body.email, hash];

    db.query(q, [values], (err, data) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json("User has been created.");
    });
  });
};

// login
const login = async (req, res) => {
  
  // VALIDATION REQUEST
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  
  //CHECK USER
  const q = "SELECT * FROM users WHERE username = ?";

  db.query(q, [req.body.username], (err, data) => {
    if (err) return res.status(500).json(err);
    if (data.length === 0) return res.status(404).json("User not found!");

    //Check password by compare
    const isPasswordCorrect = bcrypt.compareSync(
      req.body.password,
      data[0].password
    );
    
    if (!isPasswordCorrect)
      return res.status(400).json("Wrong username or password!");
    
    // generate token from id user
    const token = jwt.sign({ id: data[0].id }, "jwtkey");
    const { password, ...other } = data[0];
    
    // send cookie to client this file,
    // have informations user id username email
    res.cookie("access_token", token, {
        httpOnly: true,
      }).status(200).json(other);
  });
};

// logout
const logout = async (req, res) => {
  // clear token in client
  res.clearCookie("access_token",{
    sameSite:"none",
    secure:true
  }).status(200).json("User has been logged out.")
};

module.exports = {register, login, logout};
