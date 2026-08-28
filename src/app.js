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
const cors = require('cors')

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
}))
app.use(express.json())
app.use(cookieParser())



app.use('/', authRouter);
app.use('/', profileRouter)
app.use('/', requestRouter)
app.use('/', userRouter)
app.use("/imagekit", imageKitRouter);

connectDB().then(() => {
    console.log('DB connection successful');
    app.listen(3000, () => {
        console.log("Server successfully listening on port 3000");
    })
}).catch(err => {
    console.error("DB connection not successful: ", err)
})
