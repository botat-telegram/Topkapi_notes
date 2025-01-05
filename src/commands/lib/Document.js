const UploadFile = require("../../components/UploadFile")
const mimeTypes = require("mime-types")
const Session = require("../../Session")
const filePath = require("../../../config/BotConfig").DataFilePath

let Document = async (bot , msg) => {

    if(msg.chat.type === "group" && msg.chat.type === "supergroup"){
        bot.sendMessage(msg.chat.id , "You should be admin to upload files")
    }
    

    const userID = msg.from.id;
    const getCurrentPath = await new Session(userID).getPath()
    const fileName = `${msg.document.file_name}`.split(".").shift();
    const fileId = msg.document.file_id;
    const fileMime = mimeTypes.lookup(msg.document.file_name).split("/")
    const paid = msg.caption == "paid" ? true : false;

    await UploadFile(
        filePath,
        msg,
        {
            name: fileName,
            id: fileId,
            type: fileMime[0],
            icon: fileMime[1],
            paid : paid
        },getCurrentPath)
}


module.exports = Document