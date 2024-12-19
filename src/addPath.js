const handleCaption = require("./handleCaption");
const fs = require("fs/promises");

const addPath = async (filePath, Bot, msg) => {
    const chatId = msg.chat.id;
    const text = msg.text;

    try {
        // Extract the path from the message
        const pathSegments = handleCaption(text.slice("/newpath".length).trim());
        if (!pathSegments || !pathSegments.length) {
            throw new Error("Invalid path provided in the message text.");
        }

        // Read and parse the file content
        const fileContent = await fs.readFile(filePath, "utf-8");
        const jsonData = JSON.parse(fileContent);

        // Navigate or create the JSON structure using the path
        let currentData = jsonData;
        for (let i = 0; i < pathSegments.length; i++) {
            const segment = pathSegments[i];

            // If the segment does not exist, create it as a folder
            if (!currentData[segment]) {
                currentData[segment] = {
                    file_type: "folder",
                    content: {}
                };
            }

            // Ensure the segment is a folder
            if (currentData[segment].file_type !== "folder") {
                throw new Error(`Path segment "${segment}" is not a folder.`);
            }

            // Navigate deeper into the folder
            currentData = currentData[segment].content;
        }


        // Save the updated JSON back to the file
        await fs.writeFile(filePath, JSON.stringify(jsonData, null, 2), "utf-8");

        // Notify the user of success
        await Bot.sendMessage(chatId, "Path successfully added to the file!", {
            message_thread_id: msg.message_thread_id

        });

    } catch (err) {
        console.error("addPath error:", err);
        await Bot.sendMessage(chatId, `An error occurred: ${err.message}`, {
            message_thread_id: msg.message_thread_id

        });
    }
};

module.exports = addPath;
