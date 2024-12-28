const CreatePath = require("../components/CreatePath")

const Newpath = async (bot , msg)=>{
    
    const chatType = msg.chat.type;


    if(chatType == "group" || chatType == "supergroup"){
        bot.sendMessage(msg.chat.id , "You can not add New Path")

    }


    const getPath = msg.text.slice("/newpath".length).trim();

    await CreatePath(filePath , getPath)
}

module.exports = Newpath