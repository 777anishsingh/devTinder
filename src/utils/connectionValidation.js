const ConnectionRequest = require("../model/connectionRequestModel");
const User = require("../model/userModel");

async function reviewConnectionReqValidation(fromUserId, toUserId, status) {
    //status error
    const allowedStatus = ["accept", "reject"];
    if (!allowedStatus.includes(status)) {
        throw new Error(`Invalid status type: ${status}`)
    }

    //random fromUserId error
    const isValidFromUserId = await User.findById(fromUserId);
    if (!isValidFromUserId) {
        throw new Error("Request can't be accepted from an invalid user");
    }

    //is connecction req even received
    const connectionRequest = await ConnectionRequest.findOne({
        fromUserId: fromUserId,
        toUserId: toUserId,
        status: "interested"
    })

    if (!connectionRequest) {
        throw new Error("Connection request does not exist");
    }
    return connectionRequest;

}

async function sendConnectionReqValidation(fromUserId, toUserId, status) {

    //Status Error
    const allowedStatusTypes = ["ignore", "interested"];
    if (!allowedStatusTypes.includes(status)) {
        throw new Error(`Invalid status type: ${status}`)
    }

    //Self Request error
    if (toUserId.includes(fromUserId)) {
        throw new Error("Sending request to Self is not allowed")
    }

    //random toUserId id error
    const isValidToUserId = await User.findById(toUserId);
    if (!isValidToUserId) {
        throw new Error("Request can't be sent to an invalid user");
    }

    //duplicate request error
    const isDuplicateConnectionRequest = await ConnectionRequest.findOne({
        $or: [
            {
                fromUserId,
                toUserId
            },
            {
                fromUserId: toUserId,
                toUserId: fromUserId
            },
        ]
    })
    if (isDuplicateConnectionRequest) {
        throw new Error("Connection request already exist");
    }
}

module.exports = { sendConnectionReqValidation, reviewConnectionReqValidation } 