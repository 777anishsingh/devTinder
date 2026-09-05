const express = require('express')
const paymentRouter = express.Router()
const { userAuth } = require('../middleware/Auth')
const razorpayInstance = require("../utils/razorpay")
const Payment = require('../model/paymentModel')
const User = require('../model/userModel')
const { membershipAmount } = require('../utils/constants')
const { validateWebhookSignature } = require('razorpay/dist/utils/razorpay-utils')


paymentRouter.post('/payment/create', userAuth, async (req, res) => {
    try {

        const { membershipType } = req.body;
        const { firstName, lastName, emailId } = req.user;

        const order = await razorpayInstance.orders.create({
            "amount": membershipAmount[membershipType] * 100,
            "currency": "INR",
            "receipt": `receipt_${Date.now()}`,
            "notes": {
                firstName,
                lastName,
                emailId,
                membershipType,
            }
        })

        const payment = new Payment({
            userId: req.user._id,
            orderId: order.id,
            status: order.status,
            amount: order.amount,
            currency: order.currency,
            receipt: order.receipt,
            notes: order.notes
        })

        const savedPayment = await payment.save()

        res.json({ ...savedPayment.toJSON(), keyId: process.env.RAZORPAY_KEY_ID })

    } catch (err) {
        res.status(400).send(err);
    }
})

paymentRouter.post('/payment/webhook', async (req, res) => {
    try {
        const webhookSignature = req.get("X-Razorpay-Signature");

        const isWebhookValid = validateWebhookSignature(
            JSON.stringify(req.body),
            webhookSignature,
            process.env.RAZORPAY_WEBHOOK_SECRET
        );

        //invalid webhook signature
        if (!isWebhookValid) {
            return res.status(400).json({ message: "Webhook signature is invalid" });
        }

        //update payment status in DB
        //updat user as premium
        //return success response to razorpay

        // For payload def refer -> https://razorpay.com/docs/webhooks/payments 
        const paymentDetails = req.body.payload.payment.entity;
        const payment = await Payment.findOne({ orderId: paymentDetails.order_id });
        payment.status = paymentDetails.status;
        await payment.save();

        const user = await User.findOne({ _id: payment.userId })
        user.isPremium = true;
        user.membershipType = payment.notes.membershipType;
        await user.save();

        // if (req.body.event === "payment.captured") {

        // }
        // if (req.body.event === "payment.failed") {
        // }

        return res.status(200).json({ message: "webhook received successfully" });

    } catch (err) {
        res.status(400).send(err);
    }
})

paymentRouter.get('/payment/verify', userAuth, async (req, res) => {
    try {
        const user = req.user;
        if (user.isPremium) {
            return res.json({ isPremium: true });
        } else {
            return res.json({ isPremium: false });
        }

    } catch (err) {
        res.status(400).send(err);

    }
})

module.exports = paymentRouter;