const router = require('express').Router();
const fs = require('fs');
const Blob = require("cross-blob");

router.get('/getFile', (req, res) => {
    const nameFromRequest = req.query.file
        .replaceAll('/', '_')
        .replaceAll(' ', '+');
    const fileName = global.filesPath + '/' + nameFromRequest;
    if (fs.existsSync(fileName) === false) {
        res.staCode = 404;
        res.json({'error': 'file not found'});
        return;
    }

    const str = fs.readFileSync(fileName);
    const regex = /data:(.+);base64,(.+)/gm;
    let mimeType = '';
    let content = '';
    let m;

    while ((m = regex.exec(str)) !== null) {
        // This is necessary to avoid infinite loops with zero-width matches
        if (m.index === regex.lastIndex) {
            regex.lastIndex++;
        }
        m.forEach((match, groupIndex) => {
            if (groupIndex === 1) {
                mimeType = match;
            } else {
                content = match;
            }
        });
    }
    if (content.length === 0) {
        res.statusCode = 500;
        res.send();
        return;
    }
    if (mimeType)
        res.setHeader('content-type', mimeType);
    const data = base64toBlob(content, mimeType);
    data.arrayBuffer().then((buf) => {
        res.send(Buffer.from(buf))
    });
})

module.exports = router;

function base64toBlob(base64Data, contentType) {
    contentType = contentType || '';
    const sliceSize = 1024;
    const byteCharacters = atob(base64Data);
    const bytesLength = byteCharacters.length;
    const slicesCount = Math.ceil(bytesLength / sliceSize);
    const byteArrays = new Array(slicesCount);

    for (let sliceIndex = 0; sliceIndex < slicesCount; ++sliceIndex) {
        const begin = sliceIndex * sliceSize;
        const end = Math.min(begin + sliceSize, bytesLength);

        const bytes = new Array(end - begin);
        for (let offset = begin, i = 0; offset < end; ++i, ++offset) {
            bytes[i] = byteCharacters[offset].charCodeAt(0);
        }
        byteArrays[sliceIndex] = new Uint8Array(bytes);
    }
    return new Blob(byteArrays, {type: contentType});
}