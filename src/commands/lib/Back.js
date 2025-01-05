const Session = require("../../Session")
const SelectOperation = require("../../components/SelectOperation");
const CreateBtns = require("../../components/Buttons")


const Back = async (bot , msg) => {
    const chatID = msg.chat.id;
    const userID = msg.from.id
    try {
        const CurrentUser = await new Session(userID)
        const getPath = CurrentUser.getPath()
        const is_admin = CurrentUser.is_admin()

        if (getPath.length > 0) {
            getPath.pop();
            const getBtns = await SelectOperation(getPath , is_admin)

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