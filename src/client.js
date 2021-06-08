const {Client} = require('whatsapp-web.js');
const wss = require('./wss');
const fs = require('fs');
const QRCode = require('qrcode');

let sessionCfg;

if (fs.existsSync(global.sessionPath)) {
    sessionCfg = require(global.sessionPath);
    console.log('Session found... trying to restore.');
}

const client = new Client({
    puppeteer: {
        headless: true, args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--unhandled-rejections=strict'
        ]
    },
    session: sessionCfg,
    restartOnAuthFail: true
});

client.on('ready', () => {

    global.connected = true;
    console.log('Client is connected to Whatsapp application...');
});

client.on('qr', (qr) => {
    console.log('QR RECEIVED', qr);
    QRCode.toDataURL(qr, function (qrError, string) {
        global.qr = string;
    })
});

client.on('disconnected', (state) => {
    if (fs.existsSync(global.sessionPath)) {
        fs.unlinkSync(global.sessionPath);
    }
    client.destroy();
    client.initialize();
});

client.initialize();

module.exports = client;