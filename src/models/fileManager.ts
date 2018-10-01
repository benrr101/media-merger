import * as fs from "fs";
import * as path from "path";
import * as util from "util";

const readdir = util.promisify(fs.readdir);
const stat = util.promisify(fs.stat);

export interface IFileManager {
    getFileTree(folderPath: string, recursive: boolean): Promise<FileTree>;
}

export class FileManager implements IFileManager {
    // METHODS /////////////////////////////////////////////////////////////
    public async getFileTree(folderPath: string, recursive: boolean): Promise<FileTree> {
        // Read the items in the directory
        const fileList = await readdir(folderPath);
        if (!fileList) {
           return undefined;
        }

        const result = new FileTree(folderPath);
        for (const fileName of fileList) {
            const filePath = path.join(folderPath, fileName);

            const stats = await stat(filePath);
            if (stats.isDirectory()) {
                if (recursive) {
                    // Recurse
                    result.items.push(await this.getFileTree(filePath, recursive));
                }
            } else {
                // Add the file directly to the tree
                result.items.push(filePath);
            }
        }

        return result;
    }
}

export class FileTree {
    public name: string;
    public items: Array<FileTree|string>;

    public constructor(name: string) {
        this.name = name;
        this.items = [];
    }
}
