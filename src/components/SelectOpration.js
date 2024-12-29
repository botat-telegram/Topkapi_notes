const fs = require("fs/promises");
const icons  = require("../assets/icons")

const SelectOperation = async (filePath, currentUser) => {
    try {
        // Read the JSON structure from the provided file path
        const fileStructure = await fs.readFile(filePath, "utf-8");
        const jsonData = JSON.parse(fileStructure);

        // Navigate to the desired folder based on the current user path
        let currentData = jsonData;
        for (const segment of currentUser.path) {
            if (currentData[segment]) {
                if (currentData[segment].file_type === "folder") {
                    currentData = currentData[segment].content; // Go deeper into the folder
                } else {
                    currentData = currentData[segment]; // If it's a file, use that directly
                }
            } else {
                return "Unknown commands"; // Invalid path
            }
        }

        // Handle file or folder logic
        if (
            ["image", "video", "document"].includes(
                `${currentData.file_type}`.toLowerCase()
            )
        ) {
            // If it's a file, return its details
            return {
                fileId: currentData.file_id,
                fileIcon : currentData.file_icon,
                fileType: currentData.file_type.toLowerCase(),
            };
        } else if (currentData && typeof currentData === "object") {
            // If it's a folder, return the list of keys (subfolders or files)
            const btnName = Object.keys(currentData).map((key) => {
                const item = currentData[key];
                return `${icons[item.file_icon || "default"]} ${key}`
            });
            return btnName;
        }

        return null; // Default case
    } catch (error) {
        console.error("Error in SelectOperation:", error.message);
        return "An error occurred while processing the operation.";
    }
};

module.exports = SelectOperation;
