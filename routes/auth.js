let express = require('express');
let router = express.Router();
let user = require("../models/user")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
require("dotenv").config()

router.post('/signup', async (req, res) => {
    if (!req.body.email || !req.body.password)
        return res.status(400).send({ message: "Email and password are required." })
    const result = await user.find({ email: req.body.email.toLowerCase() })
    if (result.length > 0) {
        return res.status(400).send({ message: "email already exists" })
    }
    try {
        const salt = await bcrypt.genSalt(+process.env.SALT_ROUNDS)
        const password = await bcrypt.hash(req.body.password, salt)
        const userDetails = new user({
            name: req.body.name,
            email: req.body.email.toLowerCase(),
            password: password
        })
        const userDetailsResponse = await userDetails.save()
        if (userDetailsResponse) {
            const token = jwt.sign(req.body.email.toLowerCase(), process.env.JWT_TOKEN)
            //        const { password, ...result } = userDetailsResponse._doc
            //        result.token = token
            res.status(200).send({
                message: "Successfully created user",
                token: token
            })
        }
    }
    catch (err) {
        console.log(err)
        res.status(500).json({ error: err.message })
    }
})

router.post("/signin", async (req, res) => {
    try {
        if (!req.body.email || !req.body.password)
            return res.status(400).send({ message: "Email and password are required." })
        let result = await user.find({ email: req.body.email?.toLowerCase() })
        if (result.length > 0) {
            let valid = await bcrypt.compare(req.body.password, result[0].password)
            if (valid === true) {
                const token = jwt.sign(req.body.email.toLowerCase(), process.env.JWT_TOKEN)
                res.status(200).json({
                    message: "Successful login",
                    token: token
                })
            }
            else {
                return res.status(400).send({ message: "Incorrect password" })
            }
        } else {
            return res.status(400).send({ message: "User not found" })
        }
    }
    catch (err) {
        return res.status(500).send({ error: err.message })
    }
})


module.exports = router