const UploadFile = require("../components/UploadFile")

let Document = async (bot , msg) => {


    if(msg.chat.type != "group" || msg.chat.type != "superhroup") {
        bot.sendMessage(msg.chat.id , "You can not upload any thing to this bot")
        return;
    }

    const chatID = msg.chat.id;
    const fileName = msg.document.file_name;
    const fileId = msg.document.file_id;
    const fileType = "file"
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