const Session = require("../../Session")
const SelectOpration = require("../../components/SelectOperation");
const CreateBtns = require("../../components/Buttons");
const admins = require("../../Admin")

const Start = async (bot , msg) => {
    const chatID = msg.chat.id;
    const userID = msg.from.id;

    try {
        const session = await new Session(userID);

        const userData = {
            chatId : chatID,
            userId : userID,
            path : [],
            currentFolder: "",
            admin : admins.includes(userID) ? true : false,
            event : "",
            lastActivity: Date.now()
        }
        
        session.setItem(userData)


        const getBtns = await SelectOpration(userData.path , userData.admin)

        if (Array.isArray(getBtns)) {
            if(msg.chat.type === "group" || msg.chat.type === "supergroup"){

                bot.sendMessage(chatID, "Select folder : ", CreateBtns(getBtns))
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