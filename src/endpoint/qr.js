const router = require('express').Router();
const QRCode = require('qrcode');

router.get('/qr', (req, res) => {
    if (global.qr === null) {
        res.statusCode = 404;
        res.json({'status': 'QR code not found'});
        return;
    }
    QRCode.toDataURL(global.qr, function (qrError, string) {
        console.log(qrError);
        res.send(string);
    })
})

module.exports = router;