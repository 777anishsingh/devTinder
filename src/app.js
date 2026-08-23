require('dotenv').config()
const connectDB = require("./config/database")
const express = require('express')
const app = express()
const authRouter = require('./routes/auth')
const profileRouter = require('./routes/profile')
const cookieParser = require('cookie-parser')
const requestRouter = require('./routes/requests')
const userRouter = require('./routes/user')

app.use(express.json())
app.use(cookieParser())

app.use('/', authRouter);
app.use('/', profileRouter)
app.use('/', requestRouter)
app.use('/', userRouter)

connectDB().then(() => {
    console.log('DB connection successful');
    app.listen(3000, () => {
        console.log("Server successfully listening on port 3000");
    })
}).catch(err => {
    console.error("DB connection not successful: ", err)
})
