const fs = require('fs').promises;

/*
* أبوالهدى: نسخة اختبار لوظيفة إضافة المجلدات بدون واجهة تيليجرام
*/

// دالة معالجة المسار
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

// دالة إضافة المسار
const addPath = async (filePath, pathText) => {
    try {
        console.log("Adding path:", pathText);
        
        const pathSegments = handleCaption(pathText);
        console.log("Path segments:", pathSegments);

        if (!pathSegments || !pathSegments.length) {
            throw new Error("Invalid path provided.");
        }

        // قراءة محتوى الملف
        const fileContent = await fs.readFile(filePath, "utf-8");
        const jsonData = JSON.parse(fileContent);
        console.log("Current JSON structure:", JSON.stringify(jsonData, null, 2));

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
        console.log("Final JSON structure:", JSON.stringify(jsonData, null, 2));
        console.log("Successfully created path:", pathSegments.join("/"));

    } catch (err) {
        console.error("Error:", err.message);
    }
};

// اختبار الوظيفة
const testPaths = [
    "ntp/sinavlar/2020",
    "ntp/dersler/2021",
    "test/123/456"
];

async function runTests() {
    const testFilePath = "./data.json";
    
    // إعادة تهيئة ملف JSON
    await fs.writeFile(testFilePath, JSON.stringify({
        root: {
            file_type: "folder",
            content: {}
        }
    }, null, 2));

    console.log("Starting tests...\n");
    
    for (const path of testPaths) {
        console.log("\n=== Testing path:", path, "===");
        await addPath(testFilePath, path);
        console.log("=== Test completed ===\n");
    }
}

// تشغيل الاختبارات
runTests().catch(console.error);
