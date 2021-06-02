global.connected = false;
global.sessionPath = '/app/var/session.json';
global.qr = null;

const express = require('express');
const client = require('./client')
const app = express();
const port = process.env.PORT || 5000;


app.get('/', (req, res) => {
    console.log(global.connected);
    if (global.connected === false) {
        return;
    }

    client.getState().then((data) => {
        console.log(data)
        res.send(data)
    }).catch((err) => {
        if (err) {
            console.log(err);
            res.send("DISCONNECTED")
        }
    })
})

app.use('/', require('./endpoint/qr'));

app.listen(port);