require("dotenv").config();
const TelegramBot = require("node-telegram-bot-api");
const createKeyboard = require("./src/createKeyboard");
const addPath = require("./src/addPath");
const addFile = require("./src/addFile");
const SelectFileOpration = require("./src/SelectFileOpration");
const Bot = new TelegramBot(process.env.TELEGRAM_TOKEN, { polling: true });
const data = require("./data.json");
const stack = [];


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

    // إضافة النص إلى السجل
    if (!currentUser.path.includes(text)) {
        currentUser.path.push(text);

    }

    if (text) {
        if (text === "/start") {
            currentUser.path = [];
        }
        await SelectFileOpration(data, Bot, msg, currentUser);
    }


    if (text.startsWith("/newpath")) {
        await addPath(data, Bot, msg);
    }


    if (msg.document) {
        await addFile(data, Bot, msg, msg.document);
        console.log(msg.document.file_id);
    }

    if (msg.video) {
        await addFile(data, Bot, msg, msg.video);
    }

    if (msg.photo) {
        await addFile(data, Bot, msg, msg.photo);
    }


});

