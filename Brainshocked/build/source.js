"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setSourceFile = exports.setSource = exports.getSource = void 0;
var process_1 = require("process");
var file_1 = require("./file");
var source = ""; // Hello, World!
var sourceType = "string";
function getSource() {
    if (sourceType == "string") {
        return source;
    }
    else {
        return readSourceFile();
    }
}
exports.getSource = getSource;
function readSourceFile() {
    var result = file_1.readFile(source);
    if (typeof (result) == "undefined") {
        console.log("Failed to read file: " + source);
        process_1.exit(-1);
    }
    else {
        return result;
    }
}
function setSourceFile(path) {
    sourceType = "file";
    source = path;
}
exports.setSourceFile = setSourceFile;
function setSource(src) {
    sourceType = "string";
    source = src;
}
exports.setSource = setSource;
