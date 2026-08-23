const express = require("express");
const { userAuth } = require("../middleware/Auth");
const ConnectionRequest = require("../model/connectionRequestModel");
const { sendConnectionReqValidation, reviewConnectionReqValidation } = require("../utils/connectionValidation");
const User = require("../model/userModel");
const requestRouter = express.Router();


requestRouter.post('/request/review/:status/:fromUserId', userAuth, async (req, res) => {
    try {
        const { status, fromUserId } = req.params;
        const toUserId = req.user;
        const fromUser = await User.findById(fromUserId);

        const connectionRequest = await reviewConnectionReqValidation(fromUserId, toUserId, status);
        connectionRequest.status = status;
        const data = await connectionRequest.save();
        

        res.json({
            message: status === "accept" ? `${req.user.firstName} Accepted the connection request from ${fromUser.firstName}` : `${req.user.firstName} Rejected the connection request from ${fromUser.firstName}`,
            data,
        })

    } catch (err) {
        res.status(400).send('ERROR: ' + err.message);
    }
})

requestRouter.post('/request/send/:status/:toUserId', userAuth, async (req, res) => {

    try {
        const fromUserId = req.user._id;
        const toUserId = req.params.toUserId;
        const status = req.params.status
        const toUser = await User.findById(toUserId);

        await sendConnectionReqValidation(fromUserId, toUserId, status);

        const connectionRequest = new ConnectionRequest({
            fromUserId,
            toUserId,
            status,
        })

        const data = await connectionRequest.save();

        res.json({
            message: status === "ignore" ? `${req.user.firstName} ignored ${toUser.firstName}'s profile` : `${req.user.firstName} showed interest in ${toUser.firstName}'s profile`,
            data,
        })
    } catch (err) {
        res.status(400).send('ERROR: ' + err.message);
    }
});

module.exports = requestRouter;
