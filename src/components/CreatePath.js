const path = require("path");
const HandleCaption = require("./HandleCaption");
const fs = require("fs/promises");

const CreatePath = async (filePath, newpath) => {
    try {
        if (typeof filePath !== "string" || typeof newpath !== "string") {
            throw new Error("Invalid input: filePath and newpath must be strings.");
        }

        const pathText = newpath.trim();
        const pathSegments = HandleCaption(pathText);

        if (!pathSegments || !pathSegments.length) {
            throw new Error("Invalid path provided in the message text.");
        }

        const fileContent = await fs.readFile(filePath, "utf-8");
        const jsonData = JSON.parse(fileContent);

        let currentLevel = jsonData;
        for (const segment of pathSegments) {
            const folderKey = segment;

            console.log("Processing segment:", segment);

            if (!currentLevel[folderKey]) {
                currentLevel[folderKey] = {
                    file_type: "folder",
                    file_icon : 'folder',
                    content: {}
                };
                console.log(`Created folder: ${folderKey}`);
            } else if (currentLevel[folderKey].file_type !== "folder") {
                throw new Error(`Path segment "${segment}" exists but is not a folder.`);
            }

            currentLevel = currentLevel[folderKey].content;
        }

        await fs.writeFile(filePath, JSON.stringify(jsonData, null, 2), "utf-8");


        console.log("Path successfully created!");

    } catch (err) {
        console.error("Error creating path:", err.message);
        throw err; // Re-throw the error after logging
    }
};

module.exports = CreatePath;
