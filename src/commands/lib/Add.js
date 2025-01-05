const DirectoryManager = require("../../DirectoryManager")
const Session = require("../../Session");
const filePath = require("../../../config/BotConfig").DataFilePath;

const Add = async (bot, msg) => {
    const chatType = msg.chat.type;
    const userID = msg.from.id
    const currentFolder = new Session(userID)
    const setPath = new DirectoryManager()
    let getPath;
    // Fixing the condition to correctly validate chat types
    if (chatType !== "group" && chatType !== "supergroup") {
        bot.sendMessage(msg.chat.id, "You can not add New Path");
        return;
    }

    const is_private = `${msg.text}`.startsWith("/addprivate")
    if (is_private) {
        getPath = `${msg.text}`.slice("/addprivate".length).trim();
    } else {
        getPath = `${msg.text}`.slice("/add".length).trim();
    }
    

    currentFolder.getPath().push(getPath)

    try {
        await setPath.createPath(filePath , currentFolder.getPath() , is_private ? "private" : "public");
        bot.sendMessage(msg.chat.id, "New path added successfully.");
        currentFolder.getPath().pop()
    } catch (error) {
        console.error("Error creating path:", error);
        bot.sendMessage(msg.chat.id, "Failed to add new path.");
    }
};

module.exports = Add;
