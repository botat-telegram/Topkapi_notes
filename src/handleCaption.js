const fs = require("fs/promises");
const path = require("path");

// Ensure you have a capitalize function available
const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();

const handleCaption = (fileCaption = "") => {
    if (!fileCaption || typeof fileCaption !== "string") {
        return [];
    }

    // Normalize the file caption to path-like format
    const splitPath = fileCaption.replace(/[\\|>|-|(->)]/ig, "/").split("/");

    const filterPath = splitPath.filter(Boolean);

    const result = filterPath.map((val) => capitalize(val));

    
    return result;
};


module.exports = handleCaption