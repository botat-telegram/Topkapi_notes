const CreateInlineBtns = require("../../components/CreateInlineBtns")
const SelectOperation = require("../../components/SelectOpration")
const Session = require("../../Session")
const filepath = require("../../../config/BotConfig").DataFilePath

const Edit = async (bot, msg) => {
    try {
        const session = new Session().getItem(msg.chat.id);
        if (!session) throw new Error("Session not found");
    
        const getOperation = await SelectOperation(filepath, session);
        console.log("getOperation:", getOperation);
    
        if (!getOperation || getOperation.length === 0) {
            bot.sendMessage(msg.chat.id, "No operations available to edit.");
            return;
        }
    
        const getInlineBtns = CreateInlineBtns(getOperation);
        console.log("Inline Buttons:", getInlineBtns);
    
        bot.sendMessage(msg.chat.id, "Select one of these to Edit: ", {
            reply_markup: getInlineBtns,
        });

        
    } catch (error) {
        console.error("Error in Edit function:", error);
        bot.sendMessage(msg.chat.id, "An error occurred while processing your request.");
    }
    
};


module.exports = Edit;