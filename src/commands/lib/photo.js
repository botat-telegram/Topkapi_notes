const UploadFile = require("../../components/UploadFile")

const Photo = async (bot , msg) => {


    const chatID = msg.chat.id;
    const photos = msg.photo[msg.photo.length - 1];
    const photoId = photos.file_id;
    const photoCaption = msg.caption;
    const msgId = msg.message_id;


    await bot.sendMessage(chatID, "Write File Name:", {
        reply_to_message_id: msgId,
    });


    bot.onReplyToMessage(chatID, msgId, async (replyMsg) => {
        const photoName = replyMsg.text;

        await UploadFile(
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


        await bot.sendMessage(chatID, "File information has been saved!" , {
            message_thread_id : msg.message_thread_id
        });
    });
}

module.exports = Photo