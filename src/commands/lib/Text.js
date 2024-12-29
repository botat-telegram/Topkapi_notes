const Session = require("../../Session")
const SelectOpration = require("../../components/SelectOpration");
const CreateBtns = require("../../components/CreateBtns")
const filePath = require("../../../config/BotConfig").DataFilePath

const Text = async (bot , msg) => {
    const chatID = msg.chat.id;
    const text = msg.text;

    const getCurrentUser = await new Session().getItem(chatID)

    getCurrentUser?.path.push(text.slice(2).trim())

    const getBtns = await SelectOpration(filePath, getCurrentUser)


    if (Array.isArray(getBtns)) {
        bot.sendMessage(chatID, "Select folder : ", CreateBtns(getBtns))
    } else if(getBtns?.fileType === "docuemnt") {
        bot.sendDocument(chatID , getBtns.fileId)
    }else if (getBtns?.fileType === "image"){
        bot.sendPhoto(chatID , getBtns.fileId)
    }else if (getBtns?.fileType === "video"){
        bot.sendVideo(chatID , getBtns.fileId)
    }else{
        bot.sendMessage(chatID , "Ukonwn Commands")
    }
}

module.exports = Text