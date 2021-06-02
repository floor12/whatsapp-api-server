const {Client} = require('whatsapp-web.js');
const fs = require('fs');

let sessionCfg;

console.log(global.sessionPath);

if (fs.existsSync(global.sessionPath)) {
    sessionCfg = require(global.sessionPath);
    console.log(sessionCfg);
}

const client = new Client({
    puppeteer: {
        headless: true, args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--unhandled-rejections=strict'
        ]
    }, session: sessionCfg
});


client.on('qr', (qr) => {
    console.log('QR RECEIVED', qr);
    global.connected = true;
    global.qr = qr;
});

client.on('ready', () => {
    global.connected = true;
    console.log('Client is ready!');
});

client.on('authenticated', (session) => {
    global.connected = true;
    global.qr = null
    fs.writeFile(global.sessionPath, JSON.stringify(session), function (err) {
        if (err) {
            console.error(err);
        }
    });
    console.log('Authenticated');
});

client.on('auth_failure', () => {
    console.log("AUTH Failed !")
    process.exit()
});

client.initialize();

module.exports = client;