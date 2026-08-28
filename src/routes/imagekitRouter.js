const express = require('express')
const imagekit = require("../config/imagekit");
const { userAuth } = require('../middleware/Auth');

const imageKitRouter = express.Router();

imageKitRouter.get("/auth", userAuth, async (req, res) => {
    try {
        const { token, expire, signature } =
            imagekit.helper.getAuthenticationParameters();

        res.json({
            token,
            expire,
            signature,
            publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
        });
    } catch (err) {
        res.status(500).json({
            message: err.message,
        });
    }
});

module.exports = imageKitRouter;