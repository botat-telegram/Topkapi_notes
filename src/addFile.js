const fs = require("fs/promises");
const handleCaption = require("./handleCaption");

const addFile = async (filePath, Bot, msg, msgType) => {
    const chatId = msg.chat.id;
    const chatType = msg.chat.type;
    const caption = msg.caption;
    const fileId = msgType.file_id;
    const fileName = msgType.file_name;
    const fileExtension = fileName.split(".").pop(); // Assuming file extension is part of the fileName

    try {
        if (chatType === "group" || chatType === "supergroup") {
            if (!caption) {
                throw new Error("Caption is required to determine the file path.");
            }

            // Parse the caption into a path
            const pathSegments = handleCaption(caption);
            if (!pathSegments || !pathSegments.length) {
                throw new Error("Invalid caption format for path.");
            }

            // Read the JSON file
            const fileContent = await fs.readFile(filePath, "utf-8");
            const jsonData = JSON.parse(fileContent);

            // Navigate or create the JSON structure
            let currentData = jsonData;
            for (const segment of pathSegments) {
                if (!currentData[segment]) {
                    currentData[segment] = {
                        file_type: "folder",
                        content: {}
                    };
                }
                if (currentData[segment].file_type !== "folder") {
                    throw new Error(`Path segment "${segment}" is not a folder.`);
                }
                currentData = currentData[segment].content;
            }

            // Add the file to the final folder (check if it already exists)
            const normalizedFileName = fileName.toLowerCase();
            if (currentData[normalizedFileName]) {
                throw new Error(`A file or folder named "${fileName}" already exists.`);
            }

            // Add the new file to the content
            currentData[normalizedFileName] = {
                file_type: "file",
                file_id: fileId,
                file_extension: fileExtension // Adding the file extension
            };

            // Save the updated JSON back to the file
            await fs.writeFile(filePath, JSON.stringify(jsonData, null, 2), "utf-8");

            // Notify the user of success
            await Bot.sendMessage(chatId, `File "${fileName}" has been added successfully!`);
        } else {
            throw new Error("This action is only allowed in group or supergroup chats.");
        }
    } catch (err) {
        console.error("addFile error:", err.message);
        await Bot.sendMessage(chatId, `An error occurred: ${err.message}`);
    }
};

module.exports = addFile;
