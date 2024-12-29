const fs = require("fs");
const childProcess = require("child_process");

/**
 * Saves a backup of the given file by committing and pushing changes to a Git repository.
 * @param {string} filePath - The file or directory path to watch for changes.
 * @param {number} time - The interval in milliseconds to check for changes.
*/

const SaveBackUp = (filePath,time) => {
    setInterval(() =>{
        if (!fs.existsSync(filePath)) {
            console.error(`Error: The path "${filePath}" does not exist.`);
            return;
        }
    
        console.log(`Watching for changes in: ${filePath}`);
    
        try {
    
            // Add all changes
            childProcess.execSync(`git add ${filePath}`, { stdio: "inherit" });
    
            // Commit the changes
            childProcess.execSync(`git commit -m "uploaded By Code"`, {
                stdio: "inherit",
            });
    
            // Push the changes to the repository
            childProcess.execSync("git push", { stdio: "inherit" });
    
            console.log(`Changes committed and pushed successfully.`);
        } catch (err) {
            console.error("Error occurred while committing or pushing changes:", err.message);
    
        };
    } , time)
};

module.exports = SaveBackUp;
