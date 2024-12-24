const fs = require("fs/promises");
const handleCaption = require("./handleCaption");


const addFile = async (
    filePath = "",
    msg,
    msgContent = { file_name:"", file_id:"",file_caption :"" ,file_type:"",file_extention:""}) => {
    
    const chatType = msg.chat.type;
    const {file_name,file_id,file_caption,file_extention,file_type} = msgContent
    try {
        if (chatType === "group" || chatType === "supergroup") {
            if (!file_caption) {
                throw new Error("Caption is required to determine the file path.");
            }

            // Parse the caption into a path
            const pathSegments = handleCaption(file_caption);
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
            const normalizedFileName = file_name.toLowerCase();
            if (currentData[normalizedFileName]) {
                throw new Error(`A file or folder named "${file_name}" already exists.`);
            }

            // Add the new file to the content
            currentData[normalizedFileName] = {
                file_type: file_type,
                file_id: file_id,
                file_extension: file_extention
            };

            // Save the updated JSON back to the file
            await fs.writeFile(filePath, JSON.stringify(jsonData, null, 2), "utf-8");
        } else {
            throw new Error("This action is only allowed in group or supergroup chats.");
        }
    } catch (err) {
        console.error("addFile error:", err.message);
    }
};

module.exports = addFile;
