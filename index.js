require("dotenv").config();
const TelegramBot = require("node-telegram-bot-api");
const createKeyboard = require("./src/createKeyboard");
const mime = require("mime-types");
const Mysql = require("./src/DB/Mysql");
const addPath = require("./src/addPath");
const addFile = require("./src/addFile");
const SelectFileOpration = require("./src/SelectFileOpration");
const Bot = new TelegramBot(process.env.TELEGRAM_TOKEN, { polling: true });
const stack = [];

const db = new Mysql({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'TopkapiNotes',
    connectionLimit: 10,
});

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
        await SelectFileOpration(db, Bot, msg, currentUser);
    }


    if (text.startsWith("/newpath")) {
        await addPath(db, Bot, msg);
    }


    if (msg.document) {
        await addFile(db, Bot, msg, msg.document);
        console.log(msg.document.file_id);
    }

    if (msg.video) {
        await addFile(db, Bot, msg, msg.video);
    }

    if (msg.photo) {
        await addFile(db, Bot, msg, msg.photo);
    }


});

