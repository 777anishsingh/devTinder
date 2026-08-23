const express = require("express");
const { userAuth } = require("../middleware/Auth");
const ConnectionRequest = require("../model/connectionRequestModel");
const { connection } = require("mongoose");
const User = require("../model/userModel");
const userRouter = express.Router();

const USER_SAFE_DATA = "firstName lastName age gender photoUrl about skills"


userRouter.get('/user/feed', userAuth, async (req, res) => {
    try {

        const loggedInUser = req.user;
        const page = parseInt(req.query.page) || 1;
        let limit = parseInt(req.query.limit) || 10;
        (limit > 50) ? 50 : limit;
        const skip = (page - 1) * limit;


        const connectionRequests = await ConnectionRequest.find({
            $or: [
                { fromUserId: loggedInUser._id },
                { toUserId: loggedInUser._id }
            ]
        }).select("fromUserId toUserId");

        const hiddenUsersFromFeed = new Set();
        connectionRequests.forEach((key) => {
            hiddenUsersFromFeed.add(key.fromUserId.toString());
            hiddenUsersFromFeed.add(key.toUserId.toString());
        });

        const allowedUsersInFeed = await User.find({
            $and: [
                { _id: { $nin: Array.from(hiddenUsersFromFeed) } },
                { _id: { $ne: loggedInUser._id } }
            ]
        }).select(USER_SAFE_DATA).skip(skip).limit(limit);

        res.json({ allowedUsersInFeed });

    } catch (err) {
        res.status(400).send('ERROR: ' + err.message);
    }
})

userRouter.get('/user/connections', userAuth, async (req, res) => {
    try {

        const loggedInUser = req.user;
        const connections = await ConnectionRequest.find({
            status: "accept",
            $or: [
                { fromUserId: loggedInUser._id },
                { toUserId: loggedInUser._id }
            ]
        }).populate("fromUserId", USER_SAFE_DATA).populate("toUserId", USER_SAFE_DATA)

        const data = connections.map(key => {
            if (key.fromUserId.equals(loggedInUser._id)) {
                return key.toUserId;
            }
            return key.fromUserId;
        });


        res.json({
            message: "Connections fetched Successfully",
            data,
        })


    } catch (err) {
        res.status(400).send('ERROR: ' + err.message);
    }
})

userRouter.get('/user/requests/received', userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user;
        const connectionRequest = await ConnectionRequest.find({
            toUserId: loggedInUser._id,
            status: "interested",
        }).populate(
            "fromUserId",
            USER_SAFE_DATA
        )

        res.json({
            message: "Request fetched successfully",
            data: connectionRequest
        })
    } catch (err) {
        res.status(400).send('ERROR: ' + err.message);
    }
})

module.exports = userRouter