require("dotenv").config()

module.exports = {
    BotToken : process.env.TELEGRAM_TOKEN,
    DataFilePath : process.env.DATA_FILES_PATH
}