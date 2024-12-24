const handleCaption = require("./handleCaption");
const fs = require("fs/promises");
const backupToGithub = require("./saveBackUp");

/*
* أبوالهدى: تم تعديل دالة addPath لتتعامل مع المسارات بشكل أفضل
* المشكلة: المجلدات التي تحتوي على أرقام لا تضاف بشكل صحيح
* الحل: تبسيط عملية إضافة المجلدات وإضافة تعليمات طباعية للتتبع
*/

const addPath = async (filePath, newpath) => {
    try {
        const pathText = newpath.trim();

        const pathSegments = handleCaption(pathText);

        if (!pathSegments || !pathSegments.length) {
            throw new Error("Invalid path provided in the message text.");
        }

        const fileContent = await fs.readFile(filePath, "utf-8");
        const jsonData = JSON.parse(fileContent);

        let currentLevel = jsonData;
        for (const segment of pathSegments) {
            console.log("Processing segment:", segment);

            if (!currentLevel[segment]) {
                currentLevel[segment] = {
                    file_type: "folder",
                    content: {}
                };
                console.log(`Created folder: ${segment}`);
            }

            if (currentLevel[segment].file_type !== "folder") {
                throw new Error(`Path segment "${segment}" exists but is not a folder.`);
            }

            currentLevel = currentLevel[segment].content;
        }

        await fs.writeFile(filePath, JSON.stringify(jsonData, null, 2), "utf-8");

    } catch (err) {
        return err;
    }
};

module.exports = addPath;
