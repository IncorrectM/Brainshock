import { exit } from "process";
import { readFile } from "./file";

var source: string = ""; // Hello, World!
var sourceType: "file" | "string" = "string";

interface ValidationResult {
    result: boolean,
    invalidValue: string
}

function getSource(): string {
    if (sourceType == "string") {
        return source;
    } else {
        return readSourceFile();
    }
}

function readSourceFile(): string {
    const result = readFile(source);
    if (typeof (result) == "undefined") {
        console.log(`Failed to read file: ${source}`);
        exit(-1);
    } else {
        return result;
    }
}

function setSourceFile(path: string) {
    sourceType = "file";
    source = path;
}

function setSource(src: string) {
    sourceType = "string";
    source = src;
}

export { getSource, setSource, setSourceFile };