const CreateInlineBtns = (btns = []) => {
    if (!Array.isArray(btns)) {
        console.error("CreateInlineBtns: Input is not an array", btns);
        return { inline_keyboard: [] };
    }

    const inlineKeyboard = [];

    btns.forEach((btnText) => {
        const isBigButton = btnText.startsWith("**") && btnText.endsWith("**");

        if (isBigButton) {
            // Remove ** and add a big button in a separate row
            const cleanedText = btnText.replace(/^\*\*/, "").replace(/\*\*$/, "");
            inlineKeyboard.push([
                {
                    text: cleanedText,
                    callback_data: `edit_${cleanedText.replace(/\s+/g, '_').replace(/[📂]/g, '').toLowerCase()}`,
                },
            ]);
        } else {
            // Group smaller buttons into rows of 2
            const lastRow = inlineKeyboard[inlineKeyboard.length - 1];
            const smallButton = {
                text: btnText,
                callback_data: `edit_${btnText.replace(/\s+/g, '_').replace(/[📂]/g, '').toLowerCase()}`,
            };

            if (lastRow && lastRow.length < 2) {
                lastRow.push(smallButton);
            } else {
                inlineKeyboard.push([smallButton]);
            }
        }
    });

    return { inline_keyboard: inlineKeyboard };
};

module.exports = CreateInlineBtns;
