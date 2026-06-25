const userModel = require('../models/user.model');
const blackListTokenModel = require('../models/backlistToken.model');
const userService = require('../services/user.service');
const { validationResult } = require('express-validator');


module.exports.registerUser = async (req, res, next) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    console.log('Register request body:', req.body);

    const { fullname, email, password } = req.body;

    const hashedPassword = await userModel.hashPassword(password);

    try {
        const user = await userService.createUser({
            firstname: fullname.firstname,
            lastname: fullname.lastname,
            email,
            password: hashedPassword
        });

        const token = user.generateAuthToken();
        res.status(201).json({ user, token });
    } catch (err) {
        console.error('Registration error:', err.message);
        res.status(400).json({ error: err.message });
    }
}

module.exports.loginUser = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }


    const { email, password } = req.body;

    const user = await userModel.findOne({ email }).select('+password');

    if (!user) {
        return res.status(401).json({ error: 'Invalid email or password' });
    }

    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
        return res.status(401).json({ error: 'Invalid email or password' });
    }

    const token = user.generateAuthToken();

    res.status(200).json({ user, token });
}

module.exports.getUserProfile = async (req, res, next) => {
    const userId = req.user._id;

    const user = await userModel.findById(userId).select('-password');

    if (!user) {
        return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json({ user });
}

module.exports.logoutUser = async (req, res, next) => {
    const token = req.cookies.token || req.headers.authorization?.split(' ')[1];

    if (token) {
        await blackListTokenModel.create({ token });
    }

    res.clearCookie('token');
    res.status(200).json({ message: 'Logout successfully' });
}
