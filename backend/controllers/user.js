const db = require('../db')
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { validationResult } = require('express-validator');

const profile = async (req, res) => {
    console.log(req.body)
    try {
        // VALIDATION REQUEST
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        
        //CHECK USER
        const q = "SELECT * FROM users WHERE id = ?";

        db.query(q, [req.body.id], (err, data) => {
            if (err) return res.status(500).json(err);
            if (data.length === 0) return res.status(404).json("User not found!");

            //Check password by compare
            const isPasswordCorrect = bcrypt.compareSync(
                req.body.password,
                data[0].password
            );
    
            if (!isPasswordCorrect)
                return res.status(400).json("Wrong username or password!");

            const token = req.cookies.access_token;
            if (!token) return res.status(401).json("Not authenticated!");

            jwt.verify(token, "jwtkey", (err, userInfo) => {
                if (err) return res.status(403).json("Token is not valid!");
        
                const q = "SELECT username email img FROM users WHERE id = ?"

                db.query(q, [userInfo], (err, data) => {
                    if (err) return res.status(500).json(err);
                    return res.status(200).json("password has ben update");
                });
            });
        });
    } catch (err) {
        console.error("Error deleting comment:", err);
        throw err; // Re-throw for handling in your application
    }
}

// change password user
const changePsaword = async (req, res) => {
    // VALIDATION REQUEST
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const errorMessages = errors.array().map(error => error.msg).join(', ');
        return res.status(400).json({ error: errorMessages });
    }
    console.log(req.body, req.params.id)
    try {     
        //CHECK USER
        const q = "SELECT * FROM users WHERE id = ?";

        db.query(q, [req.params.id], (err, data) => {
            if (err) return res.status(500).json(err);
            if (data.length === 0) return res.status(404).json("User not found!");

            //Check password by compare
            const isPasswordCorrect = bcrypt.compareSync(
                req.body.password,
                data[0].password
            );
    
            if (!isPasswordCorrect)
                return res.status(400).json("Wrong password!");

            const token = req.cookies.access_token;
            if (!token) return res.status(401).json("Not authenticated!");

            jwt.verify(token, "jwtkey", (err, userInfo) => {
                if (err) return res.status(403).json("Token is not valid!");
                
                //HASH PASWORD USER
                const salt = bcrypt.genSaltSync(10);
                const hash = bcrypt.hashSync(req.body.newPassword, salt);

                const q = "UPDATE users SET password = ? WHERE id = ?"

                db.query(q, [hash, userInfo.id], (err, data) => {
                    if (err) return res.status(500).json(err);
                    return res.status(200).json(data[0]);
                });
            });
        });
    } catch (err) {
        console.error("Error deleting comment:", err);
        throw err; // Re-throw for handling in your application
    }
}

// change image user
const changeImg = async (req, res) => {
    console.log(req.body)
    try {
        const token = req.cookies.access_token;
        if (!token) return res.status(401).json("Not authenticated!");

        jwt.verify(token, "jwtkey", (err, userInfo) => {
            if (err) return res.status(403).json("Token is not valid!");
            
            const q = "UPDATE users SET img = ? WHERE id = ?"
            console.log(userInfo.id)

            db.query(q, [req.body.pathImg, userInfo.id], (err, data) => {
                if (err) return res.status(500).json(err);
                return res.status(200).json("Image user has ben updated");
            });
        });
    } catch (err) {
        console.error("Error deleting comment:", err);
        throw err; // Re-throw for handling in your application
    }

}

function checkAuth (token) {
    try {
        if (!token) return res.status(401).json("Not authenticated!");

        jwt.verify(token, "jwtkey", (err, userInfo) => {
            if (err) return false;
            return true;
        });
    } catch (err) {
        console.error("Error deleting comment:", err);
        throw err; // Re-throw for handling in your application
    }
}

module.exports = {profile, changePsaword, changeImg}
