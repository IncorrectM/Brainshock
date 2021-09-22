import { exit } from "process";
import { setSource, setSourceFile } from "./source";
import { runBF } from "./bf";

const args = process.argv;
const arglen = args.length;

if (arglen <= 2) {
    console.log("Invalid arguments.");
    exit(-1);
} else {
    const type = args[arglen - 2].trim();
    if (type == "-f") {
        setSourceFile(args[arglen - 1].trim());
    } else if (type == "-s") {
        setSource(args[arglen - 1].trim());
    } else {
        console.log(`Unrecgonized argument: '${type}'`);
        exit(-1);
    }
}

runBF();