const addLesson = async (db, Bot, msg) => {
  const chatId = msg.chat.id;
  const text = msg.text;

  if (msg.chat.type === "group" || msg.chat.type === "supergroup") {
      const getPath = text.slice("/newpath".length).trim();
      if (getPath) {
          try {
              const splitPath = handleCaption(getPath);

              if (splitPath.length < 2) {
                  return Bot.sendMessage(chatId, "Invalid path format. Please provide a lesson name and sections.", {
                      message_thread_id: msg.message_thread_id,
                  });
              }

              // التحقق من وجود الدرس
              const existingLesson = await db.query(
                  "SELECT lesson_id FROM Lessons WHERE lesson_name = ?",
                  [splitPath[0]]
              );

              let lessonId;
              if (existingLesson.length > 0) {
                  lessonId = existingLesson[0].lesson_id;
              } else {
                  // إضافة الدرس إذا لم يكن موجوداً
                  const addLessonResult = await db.query(
                      "INSERT INTO Lessons (lesson_name) VALUES (?)",
                      [splitPath[0]]
                  );
                  lessonId = addLessonResult.insertId;
              }

              // إضافة الأقسام
              let parentSectionId = null;
              for (const section of splitPath.slice(1)) {
                  // التحقق من وجود القسم
                  const existingSection = await db.query(
                      "SELECT section_id FROM Sections WHERE section_name = ? AND lesson_id = ? AND parent_section_id IS ?",
                      [section, lessonId, parentSectionId]
                  );

                  if (existingSection.length === 0) {
                      const sectionResult = await db.query(
                          "INSERT INTO Sections (section_name, lesson_id, parent_section_id) VALUES (?, ?, ?)",
                          [section, lessonId, parentSectionId]
                      );
                      parentSectionId = sectionResult.insertId;
                  } else {
                      parentSectionId = existingSection[0].section_id;
                  }
              }

              Bot.sendMessage(chatId, "Path added successfully.", {
                  message_thread_id: msg.message_thread_id,
              });
          } catch (err) {
              console.error(err);
              Bot.sendMessage(chatId, "Failed to add the path. Please try again.", {
                  message_thread_id: msg.message_thread_id,
              });
          }
      }
  }
};