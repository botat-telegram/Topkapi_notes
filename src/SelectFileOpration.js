const createKeyboard = require("./createKeyboard");
const handleCaption = require("./handleCaption");
const sendFile = require("./sendFile");

const SelectFileOperation = async (db, Bot, msg, currentUser) => {
    const chatId = msg.chat.id;
    currentUser.selected = false;
    try {
        const pathJoin = currentUser.path.join("/");

        const options = await db.query(
            "SELECT * FROM Pathes WHERE path LIKE CONCAT(?, '%')",
            [pathJoin]
        );

        if (!Array.isArray(options)) {
            throw new Error("Invalid options format. Expected an array.");
        }


        const btn = Array.from(new Set(options.map(option => {
            const caption = handleCaption(option.path);
            return caption[currentUser.path.length];
        })));

        if (currentUser.path.length > 1 && currentUser.path[currentUser.path.length - 1].endsWith(".pdf")) {
            const getFile = await db.query(
                "SELECT file_id FROM Files WHERE file_name = ? ",
                [currentUser.path[currentUser.path.length - 1] ]
            )

            Bot.sendDocument(chatId, getFile[0].file_id);
        } else {
            const undefinedState = btn.every(element => element === undefined);

            if (undefinedState) {
                const files = await db.query(
                    "SELECT file_id, file_name FROM Files WHERE path_id IN (SELECT path_id FROM Pathes WHERE path = ?)",
                    [pathJoin]
                );


                if (files.length > 0) {
                    Bot.sendMessage(chatId, "Select a file:", createKeyboard(files.map(file => file.file_name)));
                } else {
                    Bot.sendMessage(chatId, "No files available.");
                }
                return;
            }
        }

        Bot.sendMessage(chatId, "Select a file:", createKeyboard(btn));
    } catch (error) {
        console.error("Error in SelectFileOperation:", error.stack);
        Bot.sendMessage(chatId, "An error occurred. Please try again later.");
    }
};

module.exports = SelectFileOperation;
