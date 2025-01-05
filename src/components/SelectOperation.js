const fs = require("fs/promises");
const icons = require("../assets/icons");
const DirectoryManager = require("../DirectoryManager");

const SelectOperation = async (path = [] , returnFolder = false) => {
    try {
        const directoryManager = new DirectoryManager();
        const folder = await directoryManager.exists(path, true);

        if (!folder) {
            return "Path does not exist or is invalid.";
        }

        // Handle file logic
        if (
            ["image", "video", "document", "application"].includes(
                folder.type?.toLowerCase()
            )
        ) {
            return {
                id: folder.id,
                icon: folder.icon || icons.default,
                type: folder.type.toLowerCase(),
            };
        }

        // Handle folder logic
        if (typeof folder === "object") {
            const publicFolders = Object.keys(folder).filter(
                (key) => {
                    if(returnFolder){
                        return true
                    }else{
                        return folder[key].accessibility == "public"
                    }
                }
            );

            const btnNames = publicFolders.map(
                (key) =>
                    `${icons[folder[key].icon] || icons.default} ${key}`
            );

            return btnNames;
        }

        return null; // Default case if none of the above conditions match
    } catch (error) {
        console.error("Error in SelectOperation:", error.message);
        return `An error occurred while processing the operation: ${error.message}`;
    }
};

module.exports = SelectOperation;
