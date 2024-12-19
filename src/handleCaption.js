const fs = require("fs/promises");
const path = require("path");

/*
* أبوالهدى: تم تعديل دالة capitalize لتتعامل مع المجلدات التي تحتوي على أرقام فقط
* المشكلة: كانت الدالة تحاول تحويل كل النصوص (بما فيها الأرقام) إلى حرف أول كبير وباقي الحروف صغيرة
* الحل: إضافة فحص للتحقق من النص - إذا كان يحتوي على أرقام فقط نرجعه كما هو بدون تغيير
* مثال: المجلد "2020" سيبقى "2020" بدلاً من محاولة تغيير تنسيقه
*/
const capitalize = (str) => {
    // إذا كان النص يحتوي على أرقام فقط، أرجعه كما هو
    if (/^\d+$/.test(str)) {
        return str;
    }
    // وإلا قم بتكبير الحرف الأول
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

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