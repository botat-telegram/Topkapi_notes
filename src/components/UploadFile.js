const fs = require("fs/promises");
const handleCaption = require("./HandleCaption");
const path = require("path");

const UploadFile = async (
    filePath = "",
    msg,
    msgContent = { file_name: "", file_id: "", file_caption: "", file_type: "", file_extension: "" }
) => {
    const chatType = msg.chat.type;
    const { file_name, file_id, file_caption, file_extension, file_type } = msgContent;

    try {
        if (chatType !== "group" && chatType !== "supergroup") {
            throw new Error("This action is only allowed in group or supergroup chats.");
        }

        if (!file_caption) {
            throw new Error("Caption is required to determine the file path.");
        }

        const pathSegments = handleCaption(file_caption);
        if (!pathSegments || !pathSegments.length) {
            throw new Error(`Invalid caption format: "${file_caption}".`);
        }

        // Read and parse the JSON file
        const fileContent = await fs.readFile(filePath, "utf-8");
        const jsonData = JSON.parse(fileContent);

        // Navigate or create the JSON structure
        let currentData = jsonData;
        for (const segment of pathSegments) {
            const normalizedSegment = segment.toLowerCase(); // Normalize folder names for consistency

            if (!currentData[normalizedSegment]) {
                currentData[normalizedSegment] = {
                    file_type: "folder",
                    file_icon : "folder",
                    content: {}
                };
            }
            if (currentData[normalizedSegment].file_type !== "folder") {
                throw new Error(`Path segment "${segment}" is not a folder.`);
            }
            currentData = currentData[normalizedSegment].content;
        }

        // Add the file to the folder
        const normalizedFileName = file_name.toLowerCase();
        if (currentData[normalizedFileName]) {
            throw new Error(`A file or folder named "${file_name}" already exists in the specified path.`);
        }

        currentData[normalizedFileName] = {
            file_type: file_type,
            file_icon : file_type,
            file_id: file_id,
            file_extension: file_extension
        };

        // Save the updated JSON back to the file
        await fs.writeFile(filePath, JSON.stringify(jsonData, null, 2), "utf-8");
        console.log(`File "${file_name}" successfully uploaded.`);
    } catch (err) {
        console.error("UploadFile error:", err.message);
        throw err; // Re-throw for higher-level handling if needed
    }
};

module.exports = UploadFile;
