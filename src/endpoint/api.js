const router = require('express').Router();
const client = require('../client')
const mediaSaver = require('../mediaSaver')
const {MessageMedia} = require("whatsapp-web.js");
const fs = require('fs');

router.get('/api', (req, res) => {
    const bodyAsJson = req.query.body;
    if (bodyAsJson === undefined) {
        res.json({status: "error", message: "Please enter valid query body"});
        return;
    }

    const data = JSON.parse(bodyAsJson);

    if (data.method === undefined || client[data.method] === undefined) {
        res.json({status: "error", message: "Please enter valid api method"});
        return;
    }

    let parameter = null;
    if (data.params !== undefined && data.params.length > 0) {
        parameter = data.params[0];
    }

    let parameterInner0 = null;
    let parameterInner1 = null;

    if (data.innerParams !== undefined) {
        if (data.innerParams.length === 1) {
            parameterInner0 = data.innerParams[0];
        }
        // if (data.innerParams.length === 2) {
        //     parameterInner1 = d
        //     ata.innerParams[1];
        // }
    }

    if (data.innerMethod === 'sendMessage' && data.fileName) {
        const filePath = global.uploadsPath + '/' + data.fileName;
        parameterInner0 = MessageMedia.fromFilePath(filePath);
        fs.unlinkSync(filePath);
    }

    client[data.method](parameter).then((result) => {
        if (data.innerMethod === undefined || data.innerMethod === null) {
            res.json(result);
        } else {
            result[data.innerMethod](parameterInner0).then((innerResult) => {
                if (data.innerMethod === 'fetchMessages') {
                    innerResult.map((message) => {
                        if (message.hasMedia) {
                            message.downloadMedia().then((media) => {
                                mediaSaver(message.mediaKey, media)
                            }).catch((error) => {
                                console.error(error);
                            })
                        }
                    });
                }
                res.json(innerResult);
            })
        }

    }).catch((err) => {
        console.log(err);
        res.json({status: "error", message: "Error while sending request to Whatsapp Application"});
    })

})

module.exports = router;