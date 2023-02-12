const express = require('express');
let router = express.Router();
const jwt = require("jsonwebtoken")
const user = require("../models/user")
const post = require("../models/post")
require("dotenv").config()

router.post('/', async (req, res) => {
    const { message } = req.body
    const validEmail = req.userEmail
    if (!message || message.trim().length === 0) {
        return res.status(400).json({ message: "Invalid message" })
    }
    try {
        const userData = await user.findOne({ email: validEmail })
        if (Object.keys(userData).length > 0) {
            try {
                const postData = new post({
                    message: req.body.message.trim(),
                    user: userData._id
                })
                let postDataResponse = await postData.save()

                let originalPosts = userData.posts
                originalPosts.push(postDataResponse._id)
                const updatedUserData = await user.findOneAndUpdate({ _id: userData._id }, { posts: originalPosts }, { new: true })
                if (Object.keys(updatedUserData).length > 0) {
                    res.status(200).json({ message: "Successfully posted" })
                }
            } catch (err) {
                return res.status(500).json({ error: err.message })
            }
        } else {
            return res.status(400).status("Invalid token")
        }

    } catch (err) {
        return res.status(500).json({ error: err.message })
    }
})

router.get("/", async (req, res) => {
    let { email } = req.query
    if (email) {
        try {
            let userPosts = await user.findOne({ email }).populate({
                path: "posts",
                select: "message"
            })
            if (userPosts.posts.length > 0) {
                let { password, ...result } = userPosts._doc
                res.status(200).send({ message: result })
            }
            else {
                res.status(200).send({ message: "No posts found" })
            }
        } catch (err) {
            return res.status(404).send({
                message: "User not found",
                error: err.message
            })
        }
    }
    try {
        const validEmail = req.userEmail
        if (validEmail) {
            let messageData = await post.find().populate({
                path: "user",
                select: "name email"
            })

            res.status(200).json({ message: messageData })
        }

    } catch (err) {
        return res.status(403).json({ error: err.message })

    }

})

module.exports = router