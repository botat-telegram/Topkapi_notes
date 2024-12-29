// تحميل المتغيرات البيئية أولاً
require('dotenv').config();

const TelegramBot = require("node-telegram-bot-api");
const commands = require("./src/commands/index");
const SaveBackUp = require('./src/components/SaveBackUp');
const filePath = require("./config/BotConfig").DataFilePath
const icons = require("./src/assets/icons")
const Bot = new TelegramBot(require("./config/BotConfig").BotToken , { polling: true });
const saveBackUpTime = 7 * 24 * 60 * 60 * 1000


// handle words
Bot.onText(/^\/start/, (msg) => commands.Start(Bot , msg));
Bot.onText(new RegExp(`^(${icons.back})\\s*back$`, "i"), (msg) => commands.Back(Bot , msg));



// Group or SuperGroup commands
Bot.onText(/^\/newpath/i , (msg) => commands.Newpath(Bot , msg));
Bot.onText(/^edit/i , (msg) => commands.Edit(Bot , msg))

// Accept any thing without special commands
const anyWord = /^(?!\/(?:start|edit|newpath)$)(?!.*\bback\b)(?!.*\bedit\b).*$/i;
Bot.onText(anyWord, (msg) => commands.Text(Bot , msg));


// handle upload files images etc.
Bot.on("document", (msg) => commands.Document(Bot , msg));
Bot.on("photo", (msg) => commands.Photo(Bot , msg));


SaveBackUp(filePath,saveBackUpTime)