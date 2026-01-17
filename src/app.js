require('dotenv').config()
const connectDB = require("./config/database")
const express = require('express')
const app = express()
const validator = require('validator')
const User = require('./model/user')
const signUpValidator = require('./utils/validation')
const bcrypt = require('bcrypt')
const cookieParser = require('cookie-parser')
const jwt = require('jsonwebtoken');
const { userAuth } = require('./middleware/Auth')
app.use(express.json())
app.use(cookieParser())


//GET /profile
app.get('/profile', userAuth, async (req, res) => {

    try {
        const loggedInUser = req.user
        if (!loggedInUser) {
            throw new Error("User does not exist")
        }
        res.send(loggedInUser)
    } catch (err) {
        res.status(400).send('ERROR: ' + err.message);
    }

})

//POST /login
app.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body
        if (!validator.isEmail(email)) {
            throw new Error("Enter a valid Email Id")
        }

        const user = await User.findOne({ emailId: email })

        if (!user) {
            throw new Error("Invalid Login details")
        }
        const passwordAuth = await user.validatePassword(password)
        if (passwordAuth) {

            const token = await user.getJWT()
            res.cookie("token", token, { expires: new Date(Date.now() + 7 * 24 * 3600000) }) //7 days expiry

            res.send("Login successful")

        } else {
            throw new Error("Invalid Login details")
        }

    } catch (err) {
        res.status(400).send('ERROR: ' + err.message);
    }
})

// POST /signup
app.post('/signup', async (req, res) => {
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
        const passwordHash = await bcrypt.hash(password, 10)

        const user = new User({
            firstName,
            lastName,
            emailId,
            password: passwordHash,
            age,
            skills,
            about,
            gender,
            photoUrl
        });
        if (user?.skills.length > 10) {
            throw new Error("Only 10 skills are allowed to enter")
        }

        await user.save();
        res.send('User Created Successfully')

    } catch (err) {
        res.status(400).send('ERROR: ' + err.message);
    }
})



connectDB().then(() => {
    console.log('DB connection successful');
    app.listen(3000, () => {
        console.log("Server successfully listening on port 3000");
    })

}).catch(err => {
    console.error("DB connection not successful")
})
