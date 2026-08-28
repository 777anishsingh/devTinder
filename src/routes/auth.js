const express = require('express')
const authRouter = express.Router()
const validator = require('validator')
const User = require('../model/userModel')
const { signUpValidator } = require('../utils/validation')
const passwordHash = require('../utils/passwordHasher')

// POST /logout
authRouter.post('/logout', (req, res) => {
    res.cookie('token', null, {
        expires: new Date(Date.now())
    })
    res.send("User logout successful")
})

//POST /login
authRouter.post('/login', async (req, res) => {
    try {
        const { emailId, password } = req.body
        if (!validator.isEmail(emailId)) {
            throw new Error("Enter a valid Email Id")
        }

        const user = await User.findOne({ emailId: emailId })

        if (!user) {
            throw new Error("Email or password does not exist, Please try again.")
        }
        const isPasswordValid = await user.validatePassword(password)
        if (isPasswordValid) {

            const token = await user.getJWT()
            res.cookie("token", token, { expires: new Date(Date.now() + 7 * 24 * 3600000) }) //7 days expiry

            res.json({
                message: "Login successful",
                user,
            });

        } else {
            throw new Error("Email or password does not exist, Please try again.")
        }

    } catch (err) {
        res.status(400).send(err.message);
    }
})

// POST /signup
authRouter.post('/signup', async (req, res) => {
    try {
        //validator
        signUpValidator(req)
        const {
            firstName,
            lastName,
            emailId,
            password,
            age,
            skills,
            about,
            gender,
            photoUrl,
        } = req.body;

        //password hash
        const hashedPassword = await passwordHash(password)

        const user = new User({
            firstName,
            lastName,
            emailId,
            password: hashedPassword,
            age,
            skills,
            about,
            gender,
            photoUrl
        });

        const signedUpUser = await user.save();


        const token = await user.getJWT()
        res.cookie("token", token, { expires: new Date(Date.now() + 7 * 24 * 3600000) }) //7 days expiry

        res.json({
            message: "New user registered successfully",
            user: signedUpUser,
        })

    } catch (err) {
        res.status(400).send('ERROR: ' + err.message);
    }
})

module.exports = authRouter;