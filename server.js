const express = require('express')
const mongoose = require('mongoose')
require("dotenv").config()
const loginRoute = require("./routes/auth")
const postRoutes = require("./routes/postRoutes")
const port = process.env.PORT || 3000
const tokenAuth = require("./middleware/tokenAuth")


const app = express()
app.use(express.json())

mongoose.connect(process.env.MONGO_DB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})

mongoose.set('strictQuery', true);

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error: "));
db.once("open", function () {
    console.log("MongoDB Connected successfully");
});
app.use("/", loginRoute)
app.use("/messages", tokenAuth, postRoutes)
// app.use("/post", postRoutes)



app.listen(port, () => {
    console.log('listening on port', port)
})

