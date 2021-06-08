httpAuth = function (req, res, next) {
    const requestToken = req.header('Access-Token')
    if (requestToken === undefined || requestToken !== global.accessToken) {
        res.statusCode = 403;
        res.send('Invalid token');
        console.error('Access denied for ip ' + req.connection.remoteAddress);
        return;
    }
    next();
}


module.exports = httpAuth;
