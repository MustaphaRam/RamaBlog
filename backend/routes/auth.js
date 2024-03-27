const express = require("express");
const { register, login, logout } = require("../controllers/auth");
const { check } = require('express-validator');

const router = express.Router();

router.post("/register", [
        check('username').isLength({min:3, max:20}).withMessage('Invalid username'),
        check('email').isEmail().withMessage('Invalid email address'),
        check('password').isLength({ min: 6, max: 30 }).withMessage('Password must be between 6 and 20 characters'),
    ], register);

router.post("/login", [
    check('username').isLength({min:3, max:20}).withMessage('Invalid username'),
    check('password').isLength({ min: 6, max: 30 }).withMessage('Password must be between 6 and 20 characters'),
], login);

router.post("/logout", logout);

module.exports = router;
