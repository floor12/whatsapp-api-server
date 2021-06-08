connectionCheck = function (req, res, next) {
    if (global.connected === false) {
        res.json({'status': 'waiting'})
        return;
    }
    next();
}

module.exports = connectionCheck;