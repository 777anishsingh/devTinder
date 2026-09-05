const express = require('express')
const paymentRouter = express.Router()
const { userAuth } = require('../middleware/Auth')
const razorpayInstance = require("../utils/razorpay")
const paymentSchema = require('../model/paymentModel')
const { membershipAmount } = require('../utils/constants')


paymentRouter.post('/payment/create', userAuth, async (req, res) => {
    try {

        const { membershipName } = req.body;
        const { firstName, lastName, emailId } = req.user;

        const order = await razorpayInstance.orders.create({
            "amount": membershipAmount[membershipName] * 100,
            "currency": "INR",
            "receipt": "receipt#1",
            "notes": {
                firstName,
                lastName,
                emailId,
                membershipType: membershipName,
            }
        })

        const payment = new paymentSchema({
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

module.exports = paymentRouter;