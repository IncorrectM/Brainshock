"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var process_1 = require("process");
var source_1 = require("./source");
var bf_1 = require("./bf");
var args = process.argv;
var arglen = args.length;
if (arglen <= 2) {
    console.log("Invalid arguments.");
    process_1.exit(-1);
}
else {
    var type = args[arglen - 2].trim();
    if (type == "-f") {
        source_1.setSourceFile(args[arglen - 1].trim());
    }
    else if (type == "-s") {
        source_1.setSource(args[arglen - 1].trim());
    }
    else {
        console.log("Unrecgonized argument: '" + type + "'");
        process_1.exit(-1);
    }
}
bf_1.runBF();
