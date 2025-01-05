const fs = require("fs/promises");
const fileModel = require("../models/fileModel")

const UploadFile = async (filePath = "",msg,uploadedFile = fileModel,insertPath = []) => {
    const chatType = msg.chat.type;
    const {name , id , icon , type , paid} = uploadedFile;

    try {
        if (chatType !== "group" && chatType !== "supergroup") {
            throw new Error("This action is only allowed in group or supergroup chats.");
        }




        // Read and parse the JSON file
        const fileContent = await fs.readFile(filePath, "utf-8");
        const jsonData = JSON.parse(fileContent);

        // Navigate or create the JSON structure
        let currentData = jsonData;
        for (const segment of insertPath) {
            const normalizedSegment = segment.toLowerCase(); // Normalize folder names for consistency

            if (!currentData[normalizedSegment]) {
                currentData[normalizedSegment] = {
                    type: "folder",
                    icon : "folder",
                    content: {}
                };
            }
            if (currentData[normalizedSegment].type !== "folder") {
                throw new Error(`Path segment "${segment}" is not a folder.`);
            }
            currentData = currentData[normalizedSegment].content;
        }

        // Add the file to the folder
        const normalizedFileName = name.toLowerCase();
        if (currentData[normalizedFileName]) {
            return new Error(`A file or folder named "${name}" already exists in the specified path.`);
        }

        currentData[normalizedFileName] = {id , icon ,type , paid}

        // Save the updated JSON back to the file
        await fs.writeFile(filePath, JSON.stringify(jsonData, null, 2), "utf-8");
        console.log(`File "${name}" successfully uploaded.`);
    } catch (err) {
        console.error("UploadFile error:", err.message);
        throw err; // Re-throw for higher-level handling if needed
    }
};

module.exports = UploadFile;
