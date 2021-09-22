import * as fs from "fs";

function readFile(path: string): string | undefined {
    const stat = fs.statSync(path);
    if (stat.isDirectory()) {
        console.log(`'${path}' is a directory.`);
    } else {
        try {
            return fs.readFileSync(path, 'utf-8');
        } catch (error) {
            console.log("Failed to read file, details:");
            console.log(error);
        }
    }
}

export { readFile };