import * as fs from "fs";
import * as path from "path";
import * as util from "util";

const readdir = util.promisify(fs.readdir);
const stat = util.promisify(fs.stat);

export interface IFileManager {
    getFolderContents(folderPath: string): Promise<FolderContents>;
}

export class FileManager implements IFileManager {
    // METHODS /////////////////////////////////////////////////////////////
    public async getFolderContents(folderPath: string): Promise<FolderContents> {
        // Read the items in the directory
        const fileList = await readdir(folderPath);
        if (!fileList) {
           return undefined;
        }

        const result = new FolderContents(path.basename(folderPath));
        for (const fileName of fileList) {
            const filePath = path.join(folderPath, fileName);

            const stats = await stat(filePath);
            if (stats.isDirectory()) {
                result.folders.push(filePath);
            } else {
                result.files.push(filePath);
            }
        }

        return result;
    }
}

export class FolderContents {
    public files: string[];
    public folders: string[];
    public name: string;

    public constructor(name: string) {
        this.name = name;

        this.files = [];
        this.folders = [];
    }
}
