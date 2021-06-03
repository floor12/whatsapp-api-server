const router = require('express').Router();
const QRCode = require('qrcode');

router.get('/qr', (req, res) => {
    if (global.qr === null) {
        res.statusCode = 404;
        res.json({'status': 'QR code not found'});
        return;
    }
    QRCode.toString(global.qr, function (qrError, string) {
        console.log(qrError);
        res.setHeader('Content-Type', 'image/svg+xml');
        res.send(string);
    })
})

module.exports = router;