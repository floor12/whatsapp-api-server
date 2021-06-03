const router = require('express').Router();
const client = require('../client')


router.get('/', (req, res) => {
    client.getState().then((data) => {
        console.log(data)
        res.json({'status': 'connected'})
    }).catch((err) => {
        if (err) {
            console.log(err);
            res.json({'status': 'disconnected'})
        }
    })
})

module.exports = router;