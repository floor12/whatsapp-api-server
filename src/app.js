global.connected = false;
global.sessionPath = '/app/var/session.json';
global.qr = null;

const express = require('express');
const app = express();
const port = process.env.PORT || 5000;

app.use(function (req, res, next) {
    if (global.connected === false) {
        res.json({'status': 'waiting'})
        return;
    }
    next();
});

app.use('/', require('./endpoint/api'));
app.use('/', require('./endpoint/index'));
app.use('/', require('./endpoint/qr'));

app.listen(port);