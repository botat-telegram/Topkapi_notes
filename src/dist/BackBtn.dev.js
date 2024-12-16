"use strict";

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

var BackBtn = function BackBtn(Bot, msg) {
  if (currentUser.history.length > 1) {
    currentUser.history.pop(); // Go back one level  

    var previousLevel = currentUser.history[currentUser.history.length - 1];
    var options = previousLevel ? Object.keys(data[previousLevel]) : Object.keys(data);
    Bot.sendMessage(chatId, "Select a section:", createKeyboard([].concat(_toConsumableArray(options), ["Dön"])));
  } else {
    Bot.sendMessage(chatId, "You are at the top level. Select a lesson:", createKeyboard(Object.keys(data)));
  }

  return;
};