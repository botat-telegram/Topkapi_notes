const Session = require("../Session")
const SelectOpration = require("../components/SelectOpration");
const CreateBtns = require("../components/CreateBtns")
const filePath = require("../../config/BotConfig").DataFilePath


const Back = async (bot , msg) => {
    const chatID = msg.chat.id;

    try {
        const getCurrentUser = await new Session().getItem(chatID);

        if (getCurrentUser.path.length > 0) {
            getCurrentUser.path.pop();
            const getBtns = await SelectOpration(filePath, getCurrentUser)

            if (Array.isArray(getBtns)) {
                bot.sendMessage(chatID, "Select folder : ", CreateBtns(getBtns))
            }
        } else {
            await bot.sendMessage(chatID, "you are in main direction.");
        }
    } catch (error) {
        await bot.sendMessage(chatID, "Something is wrong, try again later.");
    }
}

module.exports = Back