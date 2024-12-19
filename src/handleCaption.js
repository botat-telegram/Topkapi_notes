const fs = require("fs/promises");
const path = require("path");

/*
* أبوالهدى: تم تعديل دالة handleCaption لتتعامل مع المسارات بشكل أفضل
* المشكلة: المجلدات التي تحتوي على أرقام لا تضاف بشكل صحيح
* الحل: تبسيط عملية معالجة المسار وإزالة التعديلات غير الضرورية على النص
*/
const handleCaption = (fileCaption = "") => {
    console.log("Original caption:", fileCaption);

    if (!fileCaption || typeof fileCaption !== "string") {
        console.log("Invalid caption, returning empty array");
        return [];
    }

    // تقسيم المسار وتنظيفه مباشرة
    const pathSegments = fileCaption
        .split(/[\\/>|-]/)
        .map(part => part.trim())
        .filter(part => part.length > 0);

    console.log("Path segments:", pathSegments);
    return pathSegments;
};

module.exports = handleCaption;