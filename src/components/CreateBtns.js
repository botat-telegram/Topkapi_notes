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
        const btnValue = [btns[i], btns[i + 1] || ''].filter(Boolean); // Filter out empty strings or undefined
        newBtns.push(btnValue);
    }

    return {
        reply_markup: {
            keyboard: [...newBtns , ["back"]],
            resize_keyboard: true,  // Makes the keyboard smaller
            one_time_keyboard: true, // Hides the keyboard after a button is pressed
        }
    };
};

module.exports = CreateBtns;
