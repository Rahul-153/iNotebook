const express = require('express');
const router = express.Router();
const User = require('../models/User')
const { body, validationResult } = require('express-validator');

//create a user using POST: "/api/auth". Doesn't require Auth
router.post('/', [
    body('email', 'Enter a valid email').isEmail(),
    body('password', 'Password length should be atleast 5').isLength({ min: 5 }),
    body('name', 'Enter a valid name').isLength({ min: 2 })
], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    User.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
    }).then(user => res.json(user))
        .catch(err => {
            console.log(err)
            res.json({ error: 'Please enter a unique email', message: err.message })
        });
}
);

module.exports = router; 