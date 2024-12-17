require("dotenv").config();
const TelegramBot = require("node-telegram-bot-api");
const createKeyboard = require("./src/createKeyboard");
const addPath = require("./src/addPath");
const addFile = require("./src/addFile");
const SelectFileOpration = require("./src/SelectFileOpration");



const Bot = new TelegramBot(process.env.TELEGRAM_TOKEN, { polling: true });


const stack = [];

const filePath = "./data.json"
// إعداد أوامر البوت
Bot.setMyCommands([
    { command: "/start", description: "Start the bot" }
]);

// التعامل مع الرسائل الواردة
Bot.on("message", async (msg) => {
    const chatId = msg.chat.id;
    const text = msg.text || "";

    // إدارة الجلسات
    let currentUser = stack.find((chat) => chat.chatId === chatId);
    if (!currentUser) {
        currentUser = { chatId, path: [] };
        stack.push(currentUser); 
    }

    const isFile = currentUser.path.length > 0 && /\.(pdf|mov|mp4|mp3|jpg|png|jpeg|txt|js|docx|xlsx|pptx|zip|rar|exe|md|csv|html|css|xml)$/.test(currentUser.path[currentUser.path.length - 1]);

    if (isFile) {
        currentUser.path.pop();  // Remove the last item if it's a file
    }
    
    // إضافة النص إلى السجل
    if (text && text !== "back" && !currentUser.path.includes(text)) {
        currentUser.path.push(text);
    }

    // التعامل مع العودة للخلف
    if (text === "back") {
        if (currentUser.path.length > 0) {
            currentUser.path.pop(); // Remove the last path element

            // Log for debugging
            console.log("Path after going back: ", currentUser.path);

            // إعادة تحميل العمليات المناسبة
            await SelectFileOpration(filePath, Bot, msg, currentUser);
        } else {
            // إذا كانت المسار فارغًا أو يحتوي فقط على "start"
            Bot.sendMessage(chatId, "You are at the root, there is no previous path.");
        }
        await SelectFileOpration(data, Bot, msg, currentUser);
    }

    // Command to start fresh
    if (text === "/start") {
        currentUser.path = [];
    }

    // عملية تحديد الملفات
    if (text && text !== "back") {
        await SelectFileOpration(filePath, Bot, msg, currentUser);
    }

    // إضافة مسار جديد
    if (text.startsWith("/newpath")) {
        await addPath(filePath, Bot, msg);
    }

    // التعامل مع رفع الملفات
    if (msg.document) {
        await addFile(filePath, Bot, msg, msg.document);
    } else if (msg.video) {
        await addFile(filePath, Bot, msg, msg.video);
    } else if (msg.photo) {
        await addFile(filePath, Bot, msg, msg.photo);
    }
});
