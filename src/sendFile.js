const sendFile = (db,Bot ,msg , files)=>{
    const chatId = msg.chat.id;
    const text = msg.text;
    try{

            console.log(selectFile)
            Bot.sendDocument(chatId, selectFile[0].file_id);

    }catch(error){    
        console.error("Error fetching options for level:", error);
    }
}

module.exports = sendFile