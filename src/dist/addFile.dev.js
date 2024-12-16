"use strict";

var handleCaption = require("./handleCaption");

var addFile = function addFile(db, Bot, msg, msgType) {
  var chatId, chatType, caption, fileId, fileName, fileType, hanlde_caption, getSectionId, section, checkFileExists, setFile;
  return regeneratorRuntime.async(function addFile$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          chatId = msg.chat.id;
          chatType = msg.chat.type;
          caption = msg.caption;
          fileId = msgType.file_id;
          fileName = msgType.file_name;
          fileType = msgType.mime_type;
          _context.prev = 6;

          if (!(chatType == "group" || chatType == "supergroup")) {
            _context.next = 25;
            break;
          }

          hanlde_caption = handleCaption(caption);
          _context.next = 11;
          return regeneratorRuntime.awrap(db.query("SELECT section_name , section_id FROM Section WHERE section_name = ? AND lesson_id IN (SELECT lesson_id FROM Lessons WHERE lesson_name = ?)", [hanlde_caption[1], hanlde_caption[0]]));

        case 11:
          getSectionId = _context.sent;

          if (!getSectionId || getSectionId.length > 1) {
            Bot.sendDocument(chatId, "you can not add any file to this path");
          }

          section = [getSectionId[0].section_name, getSectionId[0].section_id];
          _context.next = 16;
          return regeneratorRuntime.awrap(db.query("SELECT file_id FROM Files WHERE file_section = ? AND section_id = ? AND file_id = ?", [section[0], section[1], fileId]));

        case 16:
          checkFileExists = _context.sent;

          if (!(checkFileExists.length != 0)) {
            _context.next = 21;
            break;
          }

          Bot.sendMessage(chatId, "this file is already exists", {
            message_thread_id: msg.message_thread_id
          });
          _context.next = 25;
          break;

        case 21:
          _context.next = 23;
          return regeneratorRuntime.awrap(db.query("INSERT INTO Files (file_id, file_name, file_type, file_section, section_id) VALUES (?,?,?,?,?)", [fileId, fileName, fileType, section[0], section[1]]));

        case 23:
          setFile = _context.sent;
          Bot.sendMessage(chatId, "file added", {
            message_thread_id: msg.message_thread_id
          });

        case 25:
          _context.next = 30;
          break;

        case 27:
          _context.prev = 27;
          _context.t0 = _context["catch"](6);
          console.log("addFile error : ", _context.t0.message);

        case 30:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[6, 27]]);
};

module.exports = addFile;