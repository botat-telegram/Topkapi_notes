const fs = require("fs/promises");

const SelectOperation = async (filePath,  currentUser) => {
    let btnKeys;

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
            }else{
                return "Unkown commands";
            }
        }


        if (`${currentData.file_type}`.toLowerCase() === "image" ||
            `${currentData.file_type}`.toLowerCase() === "video" ||
            `${currentData.file_type}`.toLowerCase() === "document") {
            btnKeys = {fileId : currentData.file_id , fileType : `${currentData.file_type}`.toLowerCase()};
        } else {
            // If it's a folder, get the list of keys (subfolders or files)
            btnKeys = Object.keys(currentData);
        }
        

        return btnKeys || null
    } catch (error) {
        console.error("Error in SelectOperation:", error.stack);
    }
};

module.exports = SelectOperation;