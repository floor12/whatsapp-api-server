const router = require('express').Router();
const fs = require('fs');

router.post('/upload', (req, res) => {
    let tmpName = (+new Date).toString(36);
    let filePath = global.uploadsPath + '/' + tmpName;
    if (req.files.messageFile) {
        fs.writeFileSync(filePath, req.files.messageFile.data);
        res.send(tmpName);
    } else {
        res.statusCode = 400;
        res.send('error');
    }
});

module.exports = router;