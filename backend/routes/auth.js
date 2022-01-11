const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');

const JWT_SECRET = 'Rahul153';

//create a user using POST: "/api/auth/createUser". no login required
router.post('/createuser', [
    body('email', 'Enter a valid email').isEmail(),
    body('password', 'Password length should be atleast 5').isLength({ min: 5 }),
    body('name', 'Enter a valid name').isLength({ min: 2 })
], async (req, res) => {
    //if there are errors, return Bad request and the errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        //check whether with this email exists already

        let user = await User.findOne({ email: req.body.email });
        if (user) {
            return res.status(400).json({ error: "Sorry a user with this email already exists" })
        }
        //password hashing and salting
        const salt = await bcrypt.genSalt(10);
        const securePassword = await bcrypt.hash(req.body.password, salt);
        user = await User.create({
            name: req.body.name,
            email: req.body.email,
            password: securePassword,
        })
        //creating auth Token
        const data = {
            user: {
                id: user.id
            }
        }
        const authToken = jwt.sign(data, JWT_SECRET);
        res.json({ authToken });
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Some error occured");
    }
}
);

module.exports = router; 