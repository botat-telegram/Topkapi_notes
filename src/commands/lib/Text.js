const Session = require("../../Session")
const SelectOperation = require("../../components/SelectOperation");
const CreateBtns = require("../../components/Buttons")
const filePath = require("../../../config/BotConfig").DataFilePath
const DirectoryManager = require("../../DirectoryManager");

const Text = async (bot , msg) => {
    const chatID = msg.chat.id;
    const userID = msg.from.id;
    const text = msg.text;

    const getCurrentUser = await new Session(userID)
    const setFolder = new DirectoryManager()
    const getPath = getCurrentUser.getPath()
    const is_admin = getCurrentUser.is_admin()

    
    getPath?.push(text.slice(2).trim())

    if(is_admin){
        getCurrentUser.setCurrentFolder(getPath.includes(text.slice(2).trim()) ? text : "")
    }

    const getBtns = await SelectOperation(getPath , is_admin)


    if (Array.isArray(getBtns)) {
        bot.sendMessage(chatID, "Select folder : ", CreateBtns(getBtns) , {
            message_thread_id : msg.message_thread_id
        })
    } else if(getBtns?.type === "docuemnt" || getBtns?.type === "application") {
        bot.sendDocument(chatID , getBtns.id)
        getPath?.pop()
    }else if (getBtns?.type === "image"){
        bot.sendPhoto(chatID , getBtns.id);
        getPath?.pop()
    }else if (getBtns?.type === "video"){
        bot.sendVideo(chatID , getBtns.id)
        getPath?.pop()
    }else{
        bot.sendMessage(chatID , "Ukonwn Commands")
    }
}

module.exports = Text