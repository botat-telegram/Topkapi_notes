const handleCaption = require("./handleCaption");

const addLesson = async (db, Bot, msg) => {
    const chatId = msg.chat.id;
    const text = msg.text;
    console.log(stack)
    if (msg.chat.type === "group" || msg.chat.type === "supergroup") {
        const getPath = text.slice("/newpath".length).trim();
        if (getPath) {
            try {
                const splitPath = handleCaption(getPath);

                // Ensure the path has sufficient data
                if (splitPath.length < 2) {
                    return Bot.sendMessage(chatId, "Invalid path format. Please provide a lesson name and sections.", {
                        message_thread_id: msg.message_thread_id,
                    });
                }

                // Insert the lesson name
                const addLessonResult = await db.query(
                    "INSERT INTO Lessons (lesson_name) VALUES (?)",
                    [splitPath[0]]
                );

                const lessonId = addLessonResult.insertId; // Get the ID of the newly inserted lesson

                // Insert sections (assuming sections are comma-separated after the lesson name)
                const sections = splitPath[1]

                await db.query("INSERT INTO Section (section_name, lesson_id) VALUES (?, ?)", [sections, lessonId]);

                Bot.sendMessage(chatId, "Path added successfully.", {
                    message_thread_id: msg.message_thread_id,
                });
            } catch (err) {
                console.error(err);
                Bot.sendMessage(chatId, "Failed to add the path. Please try again.", {
                    message_thread_id: msg.message_thread_id,
                });
            }
        } else {
            Bot.sendMessage(chatId, "Please provide a valid path.", {
                message_thread_id: msg.message_thread_id,
            });
        }
    } else {
        Bot.sendMessage(chatId, "This command is only available in groups or supergroups.", {
            message_thread_id: msg.message_thread_id,
        });
    }
};

module.exports = addLesson;
