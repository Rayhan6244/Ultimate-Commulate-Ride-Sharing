const userModel = require('../models/user.model');

module.exports.createUser = async (req, res, next) => ({
    fistname, lastname, email, password
}) => {
    if (!fistname || !lastname || !email || !password) {
        throw new Error('All fields are required');

    }
    const user = userModel.create({
        fullname: {
            firstname,
            lastname
        },
        email,
        password
    });
    return user;
}