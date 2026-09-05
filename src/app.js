require('dotenv').config()
const imageKitRouter = require("./routes/imagekitRouter");
const connectDB = require("./config/database")
const express = require('express')
const app = express()
const authRouter = require('./routes/auth')
const profileRouter = require('./routes/profile')
const cookieParser = require('cookie-parser')
const requestRouter = require('./routes/requests')
const userRouter = require('./routes/user')
const cors = require('cors');
const paymentRouter = require('./routes/payment');
const PORT = 3000;

const allowedOrigins = [
    "http://localhost:5173",
    "http://localhost:5174",
];

app.use(cors({
    origin: allowedOrigins,
    credentials: true,
}))
app.use(express.json())
app.use(cookieParser())


app.get("/test", (req, res) => {
    res.status(200).json({
        message: "Backend is working!",
        status: "OK"
    });
});

app.use('/', authRouter);
app.use('/', profileRouter)
app.use('/', requestRouter)
app.use('/', userRouter)
app.use('/', paymentRouter)
app.use("/imagekit", imageKitRouter);

connectDB().then(() => {
    console.log('DB connection successful');
    app.listen(PORT || 3000, () => {
        console.log(`Server successfully listening on port ${PORT || 3000}`);
    })
}).catch(err => {
    console.error("DB connection not successful: ", err)
})
