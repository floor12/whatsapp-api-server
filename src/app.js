global.connected = false;
global.sessionPath = process.env.SESSION_FILE || '/app/var/session.json';
global.filesPath = '/app/var/files';
global.uploadsPath = '/app/var/uploads';
global.qr = null;
const fs = require('fs');
global.key = fs.readFileSync(process.env.SSL_KEY);
global.cert = fs.readFileSync(process.env.SSL_CERT);

const express = require('express');
const https = require('https');
const cors = require('cors');
const busboyBodyParser = require('busboy-body-parser');

const port = process.env.PORT || 5000;
const app = express();
const server = https.createServer({key: global.key, cert: global.cert}, app);
const wss = require('./wss');

app.use(cors());
app.use(busboyBodyParser());

// Prevent API connections while Whatsapp connection is dropped
app.use(function (req, res, next) {
    if (global.connected === false) {
        res.json({'status': 'waiting'})
        return;
    }
    next();
});


// Check media folder
if (!fs.existsSync(global.filesPath)) {
    fs.mkdirSync(global.filesPath);
}

// Check uploads folder
if (!fs.existsSync(global.uploadsPath)) {
    fs.mkdirSync(global.uploadsPath);
}

app.use('/', require('./endpoint/api'));
app.use('/', require('./endpoint/upload'));
app.use('/', require('./endpoint/restart'));
app.use('/', require('./endpoint/index'));
app.use('/', require('./endpoint/getFile'));
app.use('/', require('./endpoint/qr'));

server.listen(port, () => {
    console.log('listening on ' + port);
});