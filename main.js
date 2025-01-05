require('dotenv').config();

const Telegrambot = require("node-telegram-bot-api");
const commands = require("./src/commands/index");
const SaveBackUp = require('./src/components/SaveBackUp');
const BotConfig = require("./config/BotConfig")
const icons = require("./src/assets/icons")
const bot = new Telegrambot(BotConfig.BotToken, { polling: true });
const saveBackUpTime = 7 * 24 * 60 * 60 * 1000

bot.setMyCommands([
    { command: "/start", description: "This command starts the bot" }
]);

bot.setMyCommands([
    { command: "/add", description: "Add fodler" },
    { command: "/addprivate", description: "Add private fodler" },
    { command: "/edit", description: "Edit a file's name" },
    { command: "/delete", description: "Delete a file or folder" },
    { command: "/move", description: "Move a file to another directory" }

], { scope: { type: "all_chat_administrators" } });


// handle words
bot.onText(/^\/start/, (msg) => commands.Start(bot, msg));
bot.onText(new RegExp(`^(${icons.back})\\s*back$`, "i"), (msg) => commands.Back(bot, msg));



// Group or SuperGroup commands
bot.onText(/^\/add(private)?/i, (msg) => commands.Add(bot, msg));
bot.onText(/^\/edit/i, (msg) => commands.Edit(bot, msg))




// handle upload files images etc.
bot.on("document", (msg) => {
    if (msg.chat.type === "group" || msg.chat.type === "supergroup") {
        commands.Document(bot, msg)
    }else{
        bot.sendMessage(msg.chat.id, "You should be admin to upload files");
        return;
    }
});
bot.on("photo", (msg) => {
    if (msg.chat.type === "group" || msg.chat.type === "supergroup") {
        commands.Photo(bot, msg)
    }else{
        bot.sendMessage(msg.chat.id, "You should be admin to upload files");
        return;
    }
});


// Accept any thing without special commands
const anyWord = /^(?!\/(?:start|edit|add))(?!.*\bback\b).*$/i;
bot.onText(anyWord, (msg) => commands.Text(bot, msg));
SaveBackUp(BotConfig.DataFilePath, saveBackUpTime)