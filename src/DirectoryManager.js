const fs = require("fs/promises");
const filePath = require("../config/BotConfig").DataFilePath;
const folderModel = require("./models/folderModel");


class DirectoryManager {
    #filePath = filePath;

    constructor() {}

    // Check if the folder path exists
    async exists(folderPath = [], returnPath = false) {
        if (!Array.isArray(folderPath)) {
            throw new Error("The folder path should be an array");
        }

        try {
            const readFile = await fs.readFile(this.#filePath, "utf-8");
            const jsonData = JSON.parse(readFile);

            let currentData = jsonData;
            for (const segment of folderPath) {
                if (currentData[segment]) {
                    if (currentData[segment].type === "folder") {
                        currentData = currentData[segment].content; // Go deeper into the folder
                    } else {
                        currentData = currentData[segment]; // If it's a file, use that directly
                    }
                } else {
                    return false; // Return false if the segment does not exist
                }
            }

            return returnPath ? currentData : true;
        } catch (error) {
            throw new Error(`An error occurred while checking the path: ${error.message}`);
        }
    }

    // Add a new path to the folder structure
    async createPath(filePath = "", newpath = [] , folderaccessibility = "public") {
        if (typeof filePath !== "string") {
            throw new Error("Invalid input: filePath must be a string.");
        }

        if (!Array.isArray(newpath)) {
            throw new Error("The newpath parameter must be an array.");
        }

        try {
            const fileContent = await fs.readFile(filePath, "utf-8");
            const jsonData = JSON.parse(fileContent);

            let currentLevel = jsonData;
            for (const segment of newpath) {
                if (!currentLevel[segment]) {
                    currentLevel[segment] = {
                        ...folderModel,
                        accessibility : folderaccessibility
                    }
                } else if (currentLevel[segment].type !== "folder") {
                    throw new Error(`Path segment "${segment}" exists but is not a folder.`);
                }

                currentLevel = currentLevel[segment].content;
            }

            await fs.writeFile(filePath, JSON.stringify(jsonData, null, 2), "utf-8");

            console.log(`Path ${newpath.join("/")} successfully created!`);
        } catch (err) {
            console.error(`Error creating path at ${newpath.join("/")}:`, err.message);
            throw err; // Re-throw the error after logging
        }
    }
}

module.exports = DirectoryManager;
