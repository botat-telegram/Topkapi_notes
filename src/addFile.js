// const handleCaption = require("./handleCaption");

// const addFile = async (db, Bot, msg , msgType) => {
//     const chatId = msg.chat.id;
//     const chatType = msg.chat.type;
//     const caption = msg.caption
//     const fileId = msgType.file_id;
//     const fileName = msgType.file_name
//     const fileType = msgType.mime_type
//     try {
//         if (chatType == "group" || chatType == "supergroup") {
//             const hanlde_caption = handleCaption(caption)



//             const getSectionId = await db.query(
//                 "SELECT section_name , section_id FROM Section WHERE section_name = ? AND lesson_id IN (SELECT lesson_id FROM Lessons WHERE lesson_name = ?)",
//                 [hanlde_caption[1], hanlde_caption[0]]
//             )


//             if (!getSectionId || getSectionId.length > 1) {
//                 Bot.sendDocument(chatId, "you can not add any file to this path")
//             }


//             const section = [getSectionId[0].section_name, getSectionId[0].section_id]
            
//             const checkFileExists = await db.query(
//                 "SELECT file_id FROM Files WHERE file_section = ? AND section_id = ? AND file_id = ?",
//                 [section[0], section[1] , fileId]
//             )

//             if(checkFileExists.length != 0){
//                 Bot.sendMessage(chatId , "this file is already exists" , {
//                     message_thread_id : msg.message_thread_id
//                 })
//             }else{
//                 const setFile = await db.query(
//                     "INSERT INTO Files (file_id, file_name, file_type, file_section, section_id) VALUES (?,?,?,?,?)",
//                     [fileId, fileName, fileType, section[0], section[1]]
//                 )
    
//                 Bot.sendMessage(chatId, "file added",
//                     {
//                         message_thread_id: msg.message_thread_id
//                     }
//                 )
//             }

//         }
//     } catch (err) {
//         console.log("addFile error : ", err.message);
//     }
// };

// module.exports = addFile;
