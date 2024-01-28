const { registerUser, getUsers, login } = require("./userService");
const jwt = require('jsonwebtoken');
const bcrypt = require("bcrypt");
const router = require("express").Router();


router.post('/register', registerUser);
router.post('/login',login);
router.get('/getUsers', getUsers);

module.exports = router;