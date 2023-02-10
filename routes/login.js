let express = require('express');
let router = express.Router();

router.get('/', (req, res) => {
    let data = { "hello": "priya" }
    res.send(data)
})


module.exports = router