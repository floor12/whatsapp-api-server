const fs = require('fs');

mediaSaver = (mediaKey, mediaMessage) => {
    const newName = mediaKey.replaceAll('/', '_');
    const fileName = global.filesPath + '/' + newName;
    if (fs.existsSync(fileName)) {
        return;
    }
    const content = 'data:' + mediaMessage.mimetype + ';base64,' + mediaMessage.data
    try {
        fs.writeFileSync(fileName, content);
        console.log('Media file saved successful: ' + mediaKey);
    } catch (err) {
        console.error(err);
    }
};

module.exports = mediaSaver;