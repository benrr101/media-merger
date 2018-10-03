import * as ko from "knockout";
import {IFileManager} from "../models/fileManager";

export default class FileTreeFileViewModel {
    // MEMBER FIELDS ///////////////////////////////////////////////////////
    private readonly _fileManager: IFileManager;
    private readonly _filePath: string;

    // OBSERVABLES /////////////////////////////////////////////////////////
    public displayName: KnockoutObservable<string>;

    // CONSTRUCTORS ////////////////////////////////////////////////////////
    public constructor(fileManager: IFileManager, filePath: string) {
        this._fileManager = fileManager;
        this._filePath = filePath;

        this.displayName = ko.observable<string>("Loading...");
    }

    public init = async (): Promise<void> => {
        const fileInformation = await this._fileManager.getFileInformation(this._filePath);
        this.displayName(fileInformation.name);
    }
}

