const jwt = require("jsonwebtoken")
require("dotenv").config()


const tokenAuth = (req, res, next) => {
    let token = req.headers.authorization
    if (!token)
        return res.status(403).json({ message: "UnAuthorized" })
    else {
        try {
            const validEmail = jwt.verify(token, process.env.JWT_TOKEN)
            req.userEmail = validEmail
            next()
        } catch (err) {
            return res.status(401).json({
                message: "UnAuthorized",
                error: err.message
            })
        }
    }
}

module.exports = tokenAuth