const express = require('express')
const app = express()


app.use('/test', (req, res) => {
    res.send("Server running")
})

app.listen(3000, () => {
    console.log("Hello listners");

})

