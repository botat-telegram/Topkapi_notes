const handleCaption = require("./handleCaption");
const fs = require("fs/promises");

/*
* أبوالهدى: تم تعديل دالة addPath لتتعامل مع المسارات بشكل أفضل
* المشكلة: المجلدات التي تحتوي على أرقام لا تضاف بشكل صحيح
* الحل: تبسيط عملية إضافة المجلدات وإضافة تعليمات طباعية للتتبع
*/
const addPath = async (filePath, Bot, msg) => {
    const chatId = msg.chat.id;
    const text = msg.text;

    try {
        // استخراج المسار من النص
        const pathText = text.slice("/newpath".length).trim();
        console.log("Path text:", pathText);

        const pathSegments = handleCaption(pathText);
        console.log("Path segments:", pathSegments);

        if (!pathSegments || !pathSegments.length) {
            throw new Error("Invalid path provided in the message text.");
        }

        // قراءة محتوى الملف
        const fileContent = await fs.readFile(filePath, "utf-8");
        const jsonData = JSON.parse(fileContent);

        // إنشاء المجلدات
        let currentLevel = jsonData;
        for (const segment of pathSegments) {
            console.log("Processing segment:", segment);
            
            // إنشاء المجلد إذا لم يكن موجوداً
            if (!currentLevel[segment]) {
                currentLevel[segment] = {
                    file_type: "folder",
                    content: {}
                };
                console.log(`Created folder: ${segment}`);
            }
            
            // التأكد من أن العنصر مجلد
            if (currentLevel[segment].file_type !== "folder") {
                throw new Error(`Path segment "${segment}" exists but is not a folder.`);
            }

            // الانتقال إلى المستوى التالي
            currentLevel = currentLevel[segment].content;
        }

        // حفظ التغييرات
        await fs.writeFile(filePath, JSON.stringify(jsonData, null, 2), "utf-8");
        console.log("Updated JSON data:", JSON.stringify(jsonData, null, 2));

        // إرسال رسالة نجاح
        await Bot.sendMessage(chatId, `Successfully created path: ${pathSegments.join("/")}`, {
            message_thread_id: msg.message_thread_id
        });

    } catch (err) {
        console.error("addPath error:", err);
        await Bot.sendMessage(chatId, `Error adding path: ${err.message}`, {
            message_thread_id: msg.message_thread_id
        });
    }
};

module.exports = addPath;
