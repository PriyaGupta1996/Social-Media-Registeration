let express = require('express');
let router = express.Router();
let user = require("../models/user")
const bcrypt = require("bcrypt")

router.post('/', async (req, res) => {
    let password
    try {
        let salt = await bcrypt.genSalt(10)
        password = await bcrypt.hash(req.body.password, salt)
    }
    catch (err) {
        res.status(500).json({ message: err })
    }
    try {
        const userDetails = new user({
            name: req.body.name,
            email: req.body.email,
            password: password
        })
        let userResponse = userDetails.save((err, response) => {
            if (err) {
                res.status(500).json({ message: err })
            }
            else {
                const { password, ...result } = response._doc
                res.status(200).send({ message: result })
            }
        }
        )
    }
    catch (error) {
        res.status(500).json({ messages: error })
    }

})


module.exports = router