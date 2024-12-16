require("dotenv").config();
const TelegramBot = require("node-telegram-bot-api");
const createKeyboard = require("./src/createKeyboard");
const mime = require("mime-types");
const Mysql = require("./src/DB/Mysql");
const addLesson = require("./src/addLesson");
const addFile = require("./src/addFile");
const SelectFileOpration = require("./src/SelectFileOpration");

const Bot = new TelegramBot(process.env.TELEGRAM_TOKEN, { polling: true });
const stack = [];

const db = new Mysql({
    host: 'localhost',
    user: 'root',
    password: '0123',
    database: 'TopkapiNotes',
    connectionLimit: 10,
});

// إعداد أوامر البوت
Bot.setMyCommands([
    { command: "/start", description: "Start the bot" },
    { command: "/admins", description: "Get info about the bot creator" },
]);

// التعامل مع الرسائل الواردة
Bot.on("message", async (msg) => {
    const chatId = msg.chat.id;
    const text = msg.text || "";

    // إدارة الجلسات
    let currentUser = stack.find((chat) => chat.chatId === chatId);
    if (!currentUser) {
        currentUser = { chatId, path: []};
        stack.push(currentUser);
    }

    // زر "رجوع"
    if (text === "Geri") {
        if (currentUser.path.length > 1) {
            currentUser.path.pop(); // الرجوع خطوة للخلف
            const previousLevel = currentUser.path[currentUser.path.length - 1];
            try {
                const options = await getOptionsForLevel(previousLevel, db); // استرجاع الخيارات من قاعدة البيانات
                Bot.sendMessage(chatId, "اختر من القائمة:", createKeyboard(options));
            } catch (error) {
                console.error("Error fetching options for level:", error);
                Bot.sendMessage(chatId, "حدث خطأ أثناء استرجاع الخيارات. حاول مرة أخرى.");
            }
        } else {
            Bot.sendMessage(chatId, "أنت في المستوى الأعلى بالفعل.");
        }
        return;
    }

    // إضافة النص إلى السجل
    if (!currentUser.path.includes(text)) {
        currentUser.path.push(text);
        
    }

    
    if(text) {
        if(text === "/start"){
            currentUser.path = [];
        }
        await SelectFileOpration(db, Bot, msg, currentUser);
    }

    // تنفيذ العمليات الأخرى...
   // if (text.startsWith("/newpath")) {
   //     await addLesson(db, Bot, msg);
   // }

    // if (text) {
    //     await SelectFileOpration(db, Bot, msg, currentUser);
    // }

    // if (msg.document) {
    //     // await addFile(db, Bot, msg, msg.document);
    //     console.log(msg.document.file_id);
    // }

    // if (msg.video) {
    //     await addFile(db, Bot, msg, msg.video);
    // }

    // if (msg.photo) {
    //     await addFile(db, Bot, msg, msg.photo);
    // }

});

