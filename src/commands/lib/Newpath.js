const CreatePath = require("../../components/CreatePath");
const filePath = require("../../../config/BotConfig").DataFilePath;

const Newpath = async (bot, msg) => {
    const chatType = msg.chat.type;

    // Fixing the condition to correctly validate chat types
    if (chatType !== "group" && chatType !== "supergroup") {
        bot.sendMessage(msg.chat.id, "You can not add New Path");
        return;
    }

    const getPath = msg.text.slice("/newpath".length).trim();

    try {
        await CreatePath(filePath, getPath , {returnPath : false});
        bot.sendMessage(msg.chat.id, "New path added successfully.");
    } catch (error) {
        console.error("Error creating path:", error);
        bot.sendMessage(msg.chat.id, "Failed to add new path.");
    }
};

module.exports = Newpath;
