const mongoose = require('mongoose')
const { Schema } = mongoose

const ConnectionRequestModel = new Schema(
    {
        fromUserId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "User" //reference to the User Collection
        },
        toUserId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "User"
        },
        status: {
            type: String,
            enum: {
                values: ["ignore", "interested", "accept", "reject"],
                message: `{VALUE} is incorrect status type.`
            }
        }
    },
    {
        timestamps: true,
    }
)

ConnectionRequestModel.index({ fromUserId: 1, toUserId: 1 })

module.exports = new mongoose.model('connectionRequest', ConnectionRequestModel)