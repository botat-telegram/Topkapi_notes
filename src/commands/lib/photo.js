const UploadFile = require("../../components/UploadFile");
const Session = require("../../Session");
const filePath = require("../../../config/BotConfig").DataFilePath


const Photo = async (bot, msg) => {

    const userID = msg.from.id;
    const getCurrentPath = await new Session(userID).getPath()
    const photos = msg.photo[msg.photo.length - 1];
    const photoId = photos.file_id;
    const fileName = msg.caption || `photo_${Date.now()}`

    console.log(photos)

    await UploadFile(
        filePath,
        msg,
        {
            name: fileName,
            id: photoId,
            type: "image",
            icon: "jpg",
            paid: false
        },
        getCurrentPath
    );
}

module.exports = Photo