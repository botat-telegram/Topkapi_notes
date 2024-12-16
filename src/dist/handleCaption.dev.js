"use strict";

var fs = require("fs/promises");

var path = require("path"); // Ensure you have a capitalize function available


var capitalize = function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

var handleCaption = function handleCaption() {
  var fileCaption = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "";

  if (!fileCaption || typeof fileCaption !== "string") {
    return [];
  } // Normalize the file caption to path-like format


  var splitPath = fileCaption.replace(/[\\|>|-|(->)]/ig, "/").split("/");
  var filterPath = splitPath.filter(Boolean);
  var result = filterPath.map(function (val) {
    return capitalize(val);
  });
  return result;
};

module.exports = handleCaption;