const WebSocket = require('ws');
const client = require('./client');
const QRCode = require('qrcode');
const fs = require('fs');

const wss = new WebSocket.Server({port: 8080});

wss.on('connection', function connection(ws) {

    if (global.qr) {
        ws.send(JSON.stringify({'type': 'qr', 'qr': global.qr}));
    }

    ws.on('message', function incoming(message) {
        console.log('received: %s', message);
    });

    client.on('qr', (qr) => {
        console.log('QR RECEIVED', qr);

        QRCode.toDataURL(qr, function (qrError, string) {
            global.qr = string;
            ws.send(JSON.stringify({'type': 'qr', 'qr': string}));
        })
    });


    client.on('disconnected', (state) => {
        if (fs.existsSync(global.sessionPath)) {
            fs.unlinkSync(global.sessionPath);
        }
        client.destroy();
        client.initialize();
        module.exports = client;
        setTimeout(() => {
            ws.send(JSON.stringify({'type': 'disconnected'}));
        }, 1000)
    });

    // client.on('change_state', (state) => {
    //     console.log('change_state');
    //     console.log(state);
    //     ws.send(JSON.stringify({'type': 'state', 'state': state}));
    // });

    client.on('message', () => {
        ws.send(JSON.stringify({'type': 'message'}));
    });

    client.on('message_ack', () => {
        ws.send(JSON.stringify({'type': 'message_ack'}));
    });


    client.on('authenticated', (session) => {
        global.connected = true;
        global.qr = null
        fs.writeFile(global.sessionPath, JSON.stringify(session), function (err) {
            if (err) {
                console.error(err);
            }
        });
        ws.send(JSON.stringify({'type': 'authenticated'}));
        console.log('authenticated');
    });

    client.on('auth_failure', () => {
        console.log("AUTH Failed !")
        process.exit()
    });

});

module.exports = wss;