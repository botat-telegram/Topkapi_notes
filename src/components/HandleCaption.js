const fs = require("fs/promises");


const HandleCaption = (fileCaption = "") => {

    if (!fileCaption || typeof fileCaption !== "string") {
        console.log("Invalid caption, returning empty array");
        return [];
    }

    // تقسيم المسار وتنظيفه مباشرة
    const pathSegments = fileCaption
        .split(/[\\/>|-]/)
        .map(part => part.trim())
        .filter(part => part.length > 0);

    return pathSegments;
};

module.exports = HandleCaption;