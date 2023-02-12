let express = require('express');
let router = express.Router();
let user = require("../models/user")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
require("dotenv").config()

router.post('/signup', async (req, res) => {
    let result = await user.find({ email: req.body.email.toLowerCase() })
    if (result.length > 0) {
        return res.status(400).send({ message: "email already exists" })
    }
    let password
    try {
        let salt = await bcrypt.genSalt(+process.env.SALT_ROUNDS)
        password = await bcrypt.hash(req.body.password, salt)
    }
    catch (err) {
        return res.status(500).json({ error: err.message })
    }
    try {
        const userDetails = new user({
            name: req.body.name,
            email: req.body.email.toLowerCase(),
            password: password
        })

        try {
            let userDetailsResponse = await userDetails.save()
            if (userDetailsResponse) {
                const token = jwt.sign(req.body.email.toLowerCase(), process.env.JWT_TOKEN)
                const { password, ...result } = userDetailsResponse._doc
                result.token = token
                res.status(200).send({ message: result })
            }

        }
        catch (err) {
            console.log(err)
            return res.status(500).json({ error: err.message })
        }

    }
    catch (err) {
        console.log(err)
        res.status(500).json({ error: err.message })
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