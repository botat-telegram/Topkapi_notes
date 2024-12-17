const fs = require("fs/promises");
const createKeyboard = require("./createKeyboard");
const handleCaption = require("./handleCaption");

const SelectFileOperation = async (filePath, Bot, msg, currentUser) => {
    const chatId = msg.chat.id;

    try {
        // Read the JSON structure from the provided file path
        const fileStructure = await fs.readFile(filePath, "utf-8");
        const jsonData = JSON.parse(fileStructure);

        // Navigate to the desired folder based on the current user path
        let currentData = jsonData;

        for (const segment of currentUser.path) {
            if (currentData[segment]) {
                if (currentData[segment].file_type == "folder") {
                    currentData = currentData[segment].content; // Go deeper into the folder
                } else {
                    currentData = currentData[segment]; // If it's a file, use that directly
                }
            } else {
                throw new Error(`Path segment "${segment}" not found in the structure.`);
            }
        }

        let getKeys;

        if (currentData.file_type === "folder") {
            Bot.sendDocument(chatId, currentData.file_id);
        } else {
            // If it's a folder, get the list of keys (subfolders or files)
            getKeys = Object.keys(currentData);
        }

        if (getKeys && getKeys.length > 0) {
            Bot.sendMessage(chatId, "Select one", createKeyboard(getKeys));
        }
    } catch (error) {
        console.error("Error in SelectFileOperation:", error.stack);
        Bot.sendMessage(chatId, `An error occurred: ${error.message}`);
    }
};

module.exports = SelectFileOperation;
