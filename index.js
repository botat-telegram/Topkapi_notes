// تحميل المتغيرات البيئية أولاً
require('dotenv').config();

const TelegramBot = require("node-telegram-bot-api");
const addPath = require("./src/addPath");
const addFile = require("./src/addFile");
const SelectOpration = require("./src/SelectOpration");
const getUserSession = require("./src/Session");
const createKeyboard = require('./src/createKeyboard');
const watchFile = require("./src/saveBackUp");
const saveBackUp = require('./src/saveBackUp');

const Token = process.env.TELEGRAM_TOKEN;


const Bot = new TelegramBot(Token, { polling: true });

const filePath = "./data.json"

// إعداد أوامر البوت
Bot.setMyCommands([
    { command: "/start", description: "Start the bot" }
]);

// handle words
Bot.onText(/^\/start$/, async (msg) => {
    const chatID = msg.chat.id;
    const userID = msg.from.id;

    try {
        const getCurrentUser = await getUserSession(chatID, userID);

        // reset direction

        getCurrentUser.path = [];
        const getBtns = await SelectOpration(filePath, getCurrentUser)

        if (Array.isArray(getBtns)) {
            Bot.sendMessage(chatID, "Select folder : ", createKeyboard(getBtns))
        }
    } catch (error) {
        console.error("Error processing /start command:", error);
        await Bot.sendMessage(chatID, "you are in main direction.");
    }
});

Bot.onText(/^\/newpath/i ,  async (msg)=>{
    const getPath = msg.text.slice("/newpath".length).trim();

    await addPath(filePath , getPath)
})

Bot.onText(/^back$/i, async (msg) => {
    const chatID = msg.chat.id;
    const userID = msg.from.id;

    try {
        const getCurrentUser = await getUserSession(chatID, userID);

        if (getCurrentUser.path.length > 0) {
            getCurrentUser.path.pop();
            const getBtns = await SelectOpration(filePath, getCurrentUser)

            if (Array.isArray(getBtns)) {
                Bot.sendMessage(chatID, "Select folder : ", createKeyboard(getBtns))
            }
        } else {
            await Bot.sendMessage(chatID, "you are in main direction.");
        }
    } catch (error) {
        await Bot.sendMessage(chatID, "Something is wrong, try again later.");
    }
});



// handle direction
const anyWord = /^(?!\/(?:start|edit|newpath)$)(?!back$).*/
Bot.onText(anyWord, async (msg) => {
    const chatID = msg.chat.id;
    const text = msg.text;
    const userID = msg.from.id

    const getCurrentUser = await getUserSession(chatID, userID)

    getCurrentUser.path.push(text)

    const getBtns = await SelectOpration(filePath, getCurrentUser)

    if (Array.isArray(getBtns)) {
        Bot.sendMessage(chatID, "Select folder : ", createKeyboard(getBtns))
    } else {
        Bot.sendDocument(chatID , getBtns)
    }
})




// handle upload files images etc.
Bot.on("document", async (msg) => {
    const chatID = msg.chat.id;
    const fileName = msg.document.file_name;
    const fileId = msg.document.file_id;
    const fileType = "file"
    const fileCaption = msg.caption;
    const fileExtention = fileName.split(".").pop()

    if (!fileCaption) {
        Bot.sendMessage(chatID, "write file path")
        return;
    }


    await addFile(
        filePath,
        msg,
        {
            file_name: fileName,
            file_id: fileId,
            file_caption: fileCaption,
            file_type: fileType,
            file_extention: fileExtention
        })
})


Bot.on("photo", async (msg) => {
    const chatID = msg.chat.id;
    const photos = msg.photo[msg.photo.length - 1];
    const photoId = photos.file_id;
    const photoCaption = msg.caption;
    const msgId = msg.message_id;


    const replyMessage = await Bot.sendMessage(chatID, "Write File Name", {
        reply_to_message_id: msgId,
    });


    Bot.onReplyToMessage(chatID, replyMessage.message_id, async (replyMsg) => {
        const photoName = replyMsg.text;

        await addFile(
            filePath,
            msg,
            {
                file_name: photoName,
                file_id: photoId,
                file_caption: photoCaption,
                file_type: "image",
                file_extention: "jpg",
            }
        );


        await Bot.sendMessage(chatID, "File information has been saved!");
    });
});



Bot.on("message" , (msg)=>{
    saveBackUp(filePath)
})
