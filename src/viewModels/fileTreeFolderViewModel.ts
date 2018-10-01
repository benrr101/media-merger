import * as ko from "knockout";

import {IFileManager} from "../models/fileManager";

// import FileTreeFileViewModel from "./fileTreeFileViewModel";

export default class FileTreeFolderViewModel {
    // MEMBER FIELDS ///////////////////////////////////////////////////////
    private readonly _fileManager: IFileManager;
    private readonly _folderPath: string;

    // CHILD VIEWMODELS ////////////////////////////////////////////////////

    // OBSERVABLES /////////////////////////////////////////////////////////
    public displayName: KnockoutObservable<string>;
    public isExpanded: KnockoutObservable<boolean>;

    // CONSTRUCTORS ////////////////////////////////////////////////////////
    public constructor(fileManager: IFileManager, folderPath: string) {
        // Store the most basic data and kick off the init process
        this._fileManager = fileManager;
        this._folderPath = folderPath;

        this.displayName = ko.observable<string>("Loading...");
        this.isExpanded = ko.observable<boolean>(true);

        this._init();
    }

    // EVENT HANDLERS //////////////////////////////////////////////////////
    public handleChevronClick = () => {
        this.isExpanded(!this.isExpanded());
    }

    // PRIVATE HELPERS /////////////////////////////////////////////////////
    private _init = async (): Promise<void> => {
        // Get all files and folders for this directory
        const folderContents = await this._fileManager.getFolderContents(this._folderPath);
        this.displayName(folderContents.name);
    }
}
