const CreateBtns = (btns = []) => {
    // Check if btns is an object and convert to an array of keys if true
    if (typeof btns === 'object' && !Array.isArray(btns)) {
        btns = Object.keys(btns);
    }

    // Check if btns is not an array
    if (!Array.isArray(btns)) {
        return 'The btns parameter should be an array or an object';
    }

    const newBtns = [];

    // Group the buttons into pairs
    for (let i = 0; i < btns.length; i += 2) {
        if(`${btns[i]}`.startsWith("**") && `${btns[i]}`.endsWith("**")){
            newBtns.push([`${btns[i]}`.replaceAll("*" , "")])
            if(btns[i + 1]){
                newBtns.push([`${btns[i + 1]}`.replaceAll("*" , "") || ''].filter(Boolean))
            }
        }else if (`${btns[i + 1]}`.startsWith("**") && `${btns[i + 1]}`.endsWith("**")){
            newBtns.push([`${btns[i]}`.replaceAll("*" , "")])
            newBtns.push([`${btns[i + 1]}`.replaceAll("*" , "")])
        }else{
            newBtns.push([btns[i], btns[i + 1] || ''].filter(Boolean));
        }
    }

    return {
        reply_markup: {
            keyboard: [...newBtns , [`${require("../assets/icons").back} back`]],
            resize_keyboard: true,  // Makes the keyboard smaller
            one_time_keyboard: true, // Hides the keyboard after a button is pressed
        }
    };
};

module.exports = CreateBtns;
