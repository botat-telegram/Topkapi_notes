const handleCaption = require("./handleCaption");

const addFile = async (data = {}, Bot, msg , msgType) => {
    const chatId = msg.chat.id;
    const chatType = msg.chat.type;
    const caption = msg.caption
    const fileId = msgType.file_id;
    const fileName = msgType.file_name
    const fileType = msgType.mime_type
    try {
        if (chatType == "group" || chatType == "supergroup") {
            const hanlde_caption = handleCaption(caption);
            const handle_fileName = fileName.toLowerCase()
            const head = data[hanlde_caption[0]]





            if(checkFileExists.length > 0){
                Bot.sendMessage(chatId, "File already exists.");
            }else{
                const addFileResult = await db.query(
                    "INSERT INTO Files (file_id , file_name , file_type , path_id) VALUES (?, ?, ?, (SELECT path_id FROM Pathes WHERE path = ?))",
                    [fileId , handle_fileName , fileType , hanlde_caption]
                );
                Bot.sendMessage(chatId, "File added successfully.");
            }   
        }
    } catch (err) {
        console.log("addFile error : ", err.message);
    }
};

module.exports = addFile;
