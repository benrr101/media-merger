import * as ko from "knockout";

import {IFileManager} from "../models/fileManager";
import {IFileTreeFileCallbacks, FileTreeFileViewModel} from "./fileTreeFileViewModel";

export class FileTreeFolderViewModel {
    // MEMBER FIELDS ///////////////////////////////////////////////////////
    private readonly _callbacks: IFileTreeFolderCallbacks;
    private readonly _fileManager: IFileManager;
    private readonly _folderPath: string;

    // CHILD VIEWMODELS ////////////////////////////////////////////////////
    public files: KnockoutObservableArray<FileTreeFileViewModel>;
    public folders: KnockoutObservableArray<FileTreeFolderViewModel>;

    // OBSERVABLES /////////////////////////////////////////////////////////
    public displayName: KnockoutObservable<string>;
    public isExpanded: KnockoutObservable<boolean>;
    public isSelected: KnockoutObservable<boolean>;

    // CONSTRUCTORS ////////////////////////////////////////////////////////
    public constructor(fileManager: IFileManager, callbacks: IFileTreeFolderCallbacks, folderPath: string) {
        // Store the most basic data
        this._callbacks = callbacks;
        this._fileManager = fileManager;
        this._folderPath = folderPath;

        this.files = ko.observableArray([]);
        this.folders = ko.observableArray([]);

        this.displayName = ko.observable<string>("Loading...");
        this.isExpanded = ko.observable<boolean>(false);
        this.isSelected = ko.observable<boolean>(false);
    }

    public init = async (): Promise<void> => {
        // Get all files and folders for this directory
        const folderContents = await this._fileManager.getFolderContents(this._folderPath);

        // Create new VMs for the folders in this folder
        const folders = folderContents.folders.map((folder) => {
            return new FileTreeFolderViewModel(this._fileManager, this._callbacks, folder);
        });
        const folderPromises = folders.map((folder) => folder.init());
        this.folders(folders);

        // Create new VMs for the files in this folder
        const files = folderContents.files.map((file) => {
            const callbacks = <IFileTreeFileCallbacks> {
                handleFileSelected: this._callbacks.setSelectedFile
            };

            return new FileTreeFileViewModel(this._fileManager, callbacks, file);
        });
        const filePromises = files.map((file) => file.init());
        this.files(files);

        // When everything is done, update the status
        await Promise.all([...folderPromises, ...filePromises]);
        this.displayName(folderContents.name);
        this.isExpanded(true);
    }

    // EVENT HANDLERS //////////////////////////////////////////////////////
    public handleChevronClick = () => {
        this.isExpanded(!this.isExpanded());
    }
}

export interface IFileTreeFolderCallbacks {
    setSelectedFile(file: FileTreeFileViewModel): void;
}
