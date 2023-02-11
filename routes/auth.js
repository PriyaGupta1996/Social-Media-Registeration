let express = require('express');
let router = express.Router();
let user = require("../models/user")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
require("dotenv").config()

router.post('/signup', async (req, res) => {
    let result = await user.find({ email: req.body.email })
    console.log("🚀 ~ file: auth.js:10 ~ router.post ~ result", result)
    if (result.length > 0) {
        return res.status(400).send({ message: "email already exists" })
    }
    let password
    try {
        console.log("here2")
        let salt = await bcrypt.genSalt(+process.env.SALT_ROUNDS)
        password = await bcrypt.hash(req.body.password, salt)
    }
    catch (err) {
        console.log("here3")
        console.log(err)
        return res.status(500).json({ message: err.message() })
    }
    try {
        const userDetails = new user({
            name: req.body.name,
            email: req.body.email,
            password: password
        })
        console.log("here4")
        userDetails.save((err, response) => {
            if (err) {
                console.log("here5")
                console.log(err)
                return res.status(500).json({ message: err })
            }
            else {
                console.log("here6")
                const token = jwt.sign(req.body.email.toLowerCase(), process.env.JWT_TOKEN)
                const { password, ...result } = response._doc
                result.token = token
                res.status(200).send({ message: result })
            }
        }
        )
    }
    catch (error) {
        console.log("here7")
        console.log(err)
        res.status(500).json({ messages: error })
    }


})

// router.post("/signin", (req, res) => {
//     user.find({ email: req.body.email }, async (err, result) => {
//         if (err)
//             res.status(500).send({ message: err })
//         if (result) {
//             async
//             let salt = await bcrypt.genSalt(process.env.SALT_ROUNDS)
//             password = await bcrypt.hash(req.body.password, salt)
//             bcrypt.compare(password, result.password, (err, response) => {
//                 if (err)
//                     res.status(500).send({ message: err })
//                 else if (response == true) {
//                     res.redirect("/")
//                 }
//                 else {
//                     res.status(404).send({ message: "Incorrect password" })
//                     res.redirect("/")
//                 }
//             })
//         }
//     })
// })


module.exports = router