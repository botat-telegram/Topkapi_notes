const SelectOperation = require("../../components/SelectOperation")
const Session = require("../../Session")


const Edit = async (bot, msg) => {

    const chatId = msg.chat.id
    const userID = msg.from.id

    try {
        const session = new Session(userID)

        const getCurrentFolder = session.getCurrentFolder()

        const getPath = session.getPath();

        if (!getPath) throw new Error("Session not found");


        const getOperation = await SelectOperation(getPath);
    
        if (!getOperation || getOperation.length === 0) {
            bot.sendMessage(chatId, "No operations available to edit.");
            return;
        }
    
    
        bot.sendMessage(chatId, "Write new Name for : " + getCurrentFolder);

        session.setEvent("edit")
    } catch (error) {
        console.error("Error in Edit function:", error);
        bot.sendMessage(msg.chat.id, "An error occurred while processing your request.");
    }
    
};


module.exports = Edit;