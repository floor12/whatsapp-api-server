const router = require('express').Router();

router.get('/restart', (req, res) => {
    res.send('success');
    setTimeout(() => {
        process.exit(0);
    }, 300);
});

module.exports = router;