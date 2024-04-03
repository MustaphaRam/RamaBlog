const express = require("express");
const { profile, changeImg, changePsaword } = require("../controllers/user");
const { check } = require('express-validator');

const router = express.Router();


router.get('/:id/profile', profile);
router.put('/:id/changepasword', [check('newPassword').isLength({ min: 6, max: 30 }).withMessage('Password must be between 6 and 20 characters')], changePsaword)
router.put('/:id/profile/image', changeImg)

module.exports = router;
