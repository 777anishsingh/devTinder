const express = require('express')
const profileRouter = express.Router()
const { userAuth } = require('../middleware/Auth')
const { editProfileValidation, newPasswordValidation } = require('../utils/validation')
const passwordHash = require('../utils/passwordHasher')


//PATCH /profile/password
profileRouter.patch(('/profile/password'), userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user
        await newPasswordValidation(req)
        const hashedPassword = await passwordHash(req.body.newPassword)
        loggedInUser.password = hashedPassword
        await loggedInUser.save();

        res.cookie('token', null, {
            expires: new Date(Date.now())
        })
        res.send("Password changed successfully, Please login again")
    }
    catch (err) {
        res.status(400).send('ERROR: ' + err.message);
    }
})

//POST /profile/edit
profileRouter.patch('/profile/edit', userAuth, async (req, res) => {

    try {
        if (!editProfileValidation(req)) {
            throw new Error("Edit not allowed")
        }
        const loggedInUser = req.user
        Object.keys(req.body).forEach(k =>
            loggedInUser[k] = req.body[k]
        )
        // console.log(loggedInUser);
        await loggedInUser.save()

        res.send({ message: `${loggedInUser.firstName}, Your Edit was Successful`, loggedInUser })


    } catch (err) {
        res.status(400).send(err.message);
    }
})

//GET /profile/view
profileRouter.get('/profile/view', userAuth, async (req, res) => {

    try {
        const loggedInUser = req.user
        if (!loggedInUser) {
            throw new Error("User does not exist")
        }
        res.json({
            message: "User Fetched Successfully",
            loggedInUser,
        })
    } catch (err) {
        res.status(400).send('ERROR: ' + err.message);
    }
})

module.exports = profileRouter;