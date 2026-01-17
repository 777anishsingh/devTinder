const User = require('../model/user')
const jwt = require('jsonwebtoken')

const userAuth = async (req, res, next) => {
    try {
        const token = req.cookies.token

        if (!token) {
            throw new Error("Invalid token")
        }

        const { _id } = jwt.verify(token, process.env.SECRET_KEY)
        const loggedInUser = await User.findById(_id)

        if (!loggedInUser) {
            throw new Error("User does not exist")
        }
        req.user = loggedInUser;
        next()
    } catch (err) {
        res.status(400).send('ERROR: ' + err.message);
    }
}

module.exports = { userAuth }