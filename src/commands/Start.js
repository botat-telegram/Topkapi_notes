const Session = require("../Session")
const SelectOpration = require("../components/SelectOpration");
const CreateBtns = require("../components/CreateBtns")
const filePath = require("../../config/BotConfig").DataFilePath

const Start = async (bot , msg) => {
    const chatID = msg.chat.id;
    const userID = msg.from.id;

    try {
        const session = await new Session();

        const setUser = session.setItem(chatID , {
                chatId : chatID,
                userId : userID,
                path : [],
                lastActivity: Date.now()
            })

        const getUser = session.getItem(chatID)

        const getBtns = await SelectOpration(filePath, getUser)

        if (Array.isArray(getBtns)) {
            bot.sendMessage(chatID, "Select folder : ", CreateBtns(getBtns))
        }
    } catch (error) {
        console.error("Error processing /start command:", error);
        await bot.sendMessage(chatID, "you are in main direction.");
    }
}



module.exports = Start