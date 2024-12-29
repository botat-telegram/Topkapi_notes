const Session = require("../../Session")
const SelectOpration = require("../../components/SelectOpration");
const CreateBtns = require("../../components/CreateBtns");
const icons = require("../../assets/icons");
const filePath = require("../../../config/BotConfig").DataFilePath

const Start = async (bot , msg) => {
    const chatID = msg.chat.id;
    const userID = msg.from.id;

    try {
        const session = await new Session();

        const userData = {
            chatId : chatID,
            userId : userID,
            path : [],
            lastActivity: Date.now()
        }
        
        session.setItem(chatID , userData)


        const getBtns = await SelectOpration(filePath, userData)

        if (Array.isArray(getBtns)) {
            if(msg.chat.type === "group" || msg.chat.type === "supergroup"){

                bot.sendMessage(chatID, "Select folder : ", CreateBtns([...getBtns , `**${icons.delete} Delete**` , `**${icons.edit} Edit`,`**${icons.move} Move**`]) , {
                    message_thread_id : msg.message_thread_id
                })
            }else{
                bot.sendMessage(chatID, "Select folder : ", CreateBtns(getBtns))
            }
        }
    } catch (error) {
        console.error("Error processing /start command:", error);
        await bot.sendMessage(chatID, "you are in main direction.");
    }
}



module.exports = Start