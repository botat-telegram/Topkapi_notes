const handleCaption = require("./handleCaption");

const addPath = async (db, Bot, msg) => {
    const chatId = msg.chat.id;
    const text = msg.text

    try{
        const getPath = handleCaption(text.slice("/newpath".length).trim()).join("/");

        const checkPathExists = await db.query(
            "SELECT path FROM Pathes WHERE path = ?",
            [getPath]
        )

        if (checkPathExists.length > 0) {
            Bot.sendMessage(chatId, "Path already exists.");
        } else {
            const addPathResult = await db.query(
                "INSERT INTO Pathes (path) VALUES (?)",
                [getPath]
            );
            Bot.sendMessage(chatId, "Path added successfully.");
        }
    }catch(err){
        console.log("addPath error : ", err.message);
    }

};

module.exports = addPath;
