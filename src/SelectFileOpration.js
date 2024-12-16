const createKeyboard = require("./createKeyboard");
const handleCaption = require("./handleCaption");
const sendFile = require("./sendFile");

const SelectFileOperation = async (db, Bot, msg, currentUser) => {
    const chatId = msg.chat.id;
    currentUser.selected = false;

    try {
        // Join user path to construct the current path
        const pathJoin = currentUser.path.join("/");

        // Fetch options from the database
        const options = await db.query(
            "SELECT * FROM Pathes WHERE path LIKE CONCAT(?, '%')",
            [pathJoin]
        );

        if (!Array.isArray(options)) {
            throw new Error("Invalid options format. Expected an array.");
        }

        // Create unique buttons based on the path captions
        const btn = Array.from(new Set(options.map(option => {
            const caption = handleCaption(option.path);
            return caption[currentUser.path.length];
        }))).filter(Boolean); // Filter undefined values

        // Determine the last path element
        const lastPath = currentUser.path[currentUser.path.length - 1];

        // Check if the last path is a file based on its extension
        if (/\.(pdf|doc|docx|ppt|pptx|jpg|jpeg|png|mp4|mp3|mov|mkv)$/i.test(lastPath)) {
            const getFile = await db.query(
                "SELECT file_id FROM Files WHERE file_name = ?",
                [lastPath]
            );

            if (getFile.length > 0) {
                Bot.sendDocument(chatId, getFile[0].file_id);
            } else {
                Bot.sendMessage(chatId, "File not found.");
            }
            return;
        }

        // Check if all buttons are undefined
        const undefinedState = btn.length === 0;

        if (undefinedState) {
            const files = await db.query(
                "SELECT file_name FROM Files WHERE path_id IN (SELECT path_id FROM Pathes WHERE path = ?)",
                [pathJoin]
            );

            if (files.length > 0) {
                Bot.sendMessage(chatId, "Select a file:", createKeyboard(files.map(file => file.file_name)));
            } else {
                Bot.sendMessage(chatId, "No files available.");
            }
            return;
        }

        // Send options as keyboard buttons
        Bot.sendMessage(chatId, "Select a file:", createKeyboard(btn));
    } catch (error) {
        console.error("Error in SelectFileOperation:", error.stack);
        Bot.sendMessage(chatId, `An error occurred: ${error.message}`);
    }
};

module.exports = SelectFileOperation;
