let router = express.router();

router.post('/pong', (req, res) => {
    console.log(req)
    res.send(req.body.hello1)
})

module.exports = router