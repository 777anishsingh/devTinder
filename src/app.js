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
app.use(express.json())
app.use(cookieParser())


//GET /profile
app.get('/profile', async (req, res) => {

    try {
        const token = req.cookies.token

        if (!token) {
            throw new Error("Invalid token")
        }

        const decodedUser = jwt.verify(token, process.env.SECRET_KEY)
        const loggedInUser = await User.findOne({ _id: decodedUser })

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
        const passwordAuth = await bcrypt.compare(password, user.password)
        if (passwordAuth) {

            const token = jwt.sign({ _id: user._id }, process.env.SECRET_KEY)

            res.cookie("token", token)

            res.send("Login successful")

        } else {
            throw new Error("Invalid Login details")
        }

    } catch (err) {
        res.status(400).send('ERROR: ' + err.message);
    }
})

//PATCH /user
app.patch('/user/:userId', async (req, res) => {
    const userId = req.params?.userId
    const data = req.body


    try {
        const UPDATE_INTERFACE = ["photoUrl", "about", "skills", "age"]
        const isValidUpdate = Object.keys(data).every((k) =>
            UPDATE_INTERFACE.includes(k)
        )

        if (!isValidUpdate) {
            throw new Error("Update not allowed")
        }

        if (data.skills && data?.skills.length > 10) {
            throw new Error("Only 10 skills are allowed to enter")
        }

        const updatedUser = await User.findByIdAndUpdate(userId, data, { returnDocument: 'after', runValidators: true })
        console.log(updatedUser);
        res.send("User Data Updated Successfully")

    }
    catch (err) {
        res.status(400).send('Update failed: ' + err);
    }
})

//DELETE /user
app.delete('/user', async (req, res) => {
    const userId = req.body.userId
    try {
        const user = await User.findByIdAndDelete(userId)
        if (!user) {
            res.status(404).send('User not found');
        } else {

            res.send("User deleted successfully")
        }
    }
    catch (err) {
        res.status(400).send('Something went wrong');
    }
})

// GET /user
app.get('/user', async (req, res) => {

    const email = req.body.emailId;
    try {
        const user = await User.findOne({ emailId: email })
        if (!user) {
            res.status(404).send('User not found');
        } else {
            res.send(user)
        }
    }
    catch (err) {
        res.status(400).send('Something went wrong');
    }
})

// GET /feed
app.get('/feed', async (req, res) => {
    try {
        const users = await User.find({})
        res.send(users)
    }
    catch (err) {
        res.status(400).send('Something went wrong');
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
