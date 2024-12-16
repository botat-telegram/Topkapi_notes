"use strict";

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) { return; } var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

var createKeyboard = require("./createKeyboard");

var SelectFileOperation = function SelectFileOperation(db, Bot, msg, currentUser) {
  var chatId, lessonsResult, lessons, sectionsResult, sections, filesResult, FileName, _ref, _ref2, getFile;

  return regeneratorRuntime.async(function SelectFileOperation$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          chatId = msg.chat.id;
          _context.prev = 1;
          _context.t0 = currentUser.history.length;
          _context.next = _context.t0 === 1 ? 5 : _context.t0 === 2 ? 13 : _context.t0 === 3 ? 20 : _context.t0 === 4 ? 26 : 32;
          break;

        case 5:
          if (!(currentUser.history[0] == "/start")) {
            _context.next = 12;
            break;
          }

          console.log("select lesson start");
          _context.next = 9;
          return regeneratorRuntime.awrap(db.query("SELECT lesson_name FROM Lessons"));

        case 9:
          lessonsResult = _context.sent;
          lessons = lessonsResult.map(function (lesson) {
            return lesson.lesson_name;
          });
          Bot.sendMessage(chatId, "Select a section:", createKeyboard(lessons));

        case 12:
          return _context.abrupt("break", 32);

        case 13:
          // User selected a section
          console.log("select section start");
          _context.next = 16;
          return regeneratorRuntime.awrap(db.query("SELECT section_name FROM Section WHERE lesson_id IN (SELECT lesson_id FROM Lessons WHERE lesson_name = ?)", [currentUser.history[1]]));

        case 16:
          sectionsResult = _context.sent;
          sections = sectionsResult.map(function (section) {
            return section.section_name;
          });
          Bot.sendMessage(chatId, "Select a file type:", createKeyboard(_toConsumableArray(sections)));
          return _context.abrupt("break", 32);

        case 20:
          _context.next = 22;
          return regeneratorRuntime.awrap(db.query("SELECT file_name ,file_type , file_id FROM Files WHERE section_id IN (SELECT section_id FROM Section WHERE section_name = ? AND lesson_id IN (SELECT lesson_id FROM Lessons WHERE lesson_name = ?))", [currentUser.history[2], currentUser.history[1]]));

        case 22:
          filesResult = _context.sent;
          FileName = filesResult.map(function (file) {
            return file.file_name;
          });
          Bot.sendMessage(chatId, "Select a file:", createKeyboard(_toConsumableArray(FileName)));
          return _context.abrupt("break", 32);

        case 26:
          _context.next = 28;
          return regeneratorRuntime.awrap(db.query("SELECT file_name , file_type , file_id FROM Files WHERE file_name = ? AND section_id IN (SELECT section_id FROM Section WHERE section_name = ? AND lesson_id IN (SELECT lesson_id FROM Lessons WHERE lesson_name = ?))", [currentUser.history[3], currentUser.history[2], currentUser.history[1]]));

        case 28:
          _ref = _context.sent;
          _ref2 = _slicedToArray(_ref, 1);
          getFile = _ref2[0];
          Bot.sendDocument(chatId, getFile.file_id);

        case 32:
          _context.next = 38;
          break;

        case 34:
          _context.prev = 34;
          _context.t1 = _context["catch"](1);
          console.error("Error in SelectFileOperation:", _context.t1.message);
          Bot.sendMessage(chatId, "An error occurred. Please try again later.");

        case 38:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[1, 34]]);
};

module.exports = SelectFileOperation;