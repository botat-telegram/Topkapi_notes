const UploadFile = require("../../components/UploadFile")
const mieTypes = require("mime-types")
const filePath = require("../../../config/BotConfig").DataFilePath
let Document = async (bot , msg) => {

    

    const chatID = msg.chat.id;
    const fileName = `${msg.document.file_name}`.split(".").shift();
    const fileId = msg.document.file_id;
    const fileType = mieTypes.lookup(msg.document.file_name).split("/")[0]
    const fileCaption = msg.caption;
    const fileExtention = fileName.split(".").pop()

    if (!fileCaption) {
        bot.sendMessage(chatID, "write file path")
        return;
    }


    await UploadFile(
        filePath,
        msg,
        {
            file_name: fileName,
            file_id: fileId,
            file_caption: fileCaption,
            file_type: fileType,
            file_extention: fileExtention
        })
}


module.exports = Document