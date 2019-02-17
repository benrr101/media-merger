import * as ko from "knockout";

import {IFileManager} from "../models/fileManager";
import {IFileTreeFileCallbacks, FileTreeFileViewModel} from "./fileTreeFileViewModel";

export class FileTreeFolderViewModel {
    // MEMBER FIELDS ///////////////////////////////////////////////////////
    private readonly _browserCallbacks: IFileTreeFolderBrowserCallbacks;
    private readonly _folderCallbacks: IFileTreeFolderFolderCallbacks;
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
    private constructor(
        folderPath: string,
        fileManager: IFileManager,
        browserCallbacks?: IFileTreeFolderBrowserCallbacks,
        folderCallbacks?: IFileTreeFolderFolderCallbacks
    ) {
        // Store the most basic data
        this._browserCallbacks = browserCallbacks;
        this._folderCallbacks = folderCallbacks;
        this._fileManager = fileManager;
        this._folderPath = folderPath;

        this.files = ko.observableArray([]);
        this.folders = ko.observableArray([]);

        this.displayName = ko.observable<string>("Loading...");
        this.isExpanded = ko.observable<boolean>(false);
        this.isSelected = ko.observable<boolean>(false);
    }

    public static CreateRoot(
        folderPath: string,
        fileManager: IFileManager,
        browserCallbacks: IFileTreeFolderBrowserCallbacks
    ): FileTreeFolderViewModel {
        return new FileTreeFolderViewModel(folderPath, fileManager, browserCallbacks);
    }

    public init = async (): Promise<void> => {
        const self = this;

        // Get all files and folders for this directory
        const folderContents = await this._fileManager.getFolderContents(this._folderPath);

        // Create new VMs for the folders in this folder
        const folderCallbacks = <IFileTreeFolderFolderCallbacks> {
            handleFileClick: this.handleFileClick
        };
        const folders = folderContents.folders.map((folder) => {
            return new FileTreeFolderViewModel(folder, this._fileManager, undefined, folderCallbacks);
        });
        const folderPromises = folders.map((folder) => folder.init());
        this.folders(folders);

        // Create new VMs for the files in this folder
        const files = folderContents.files.map((file) => {
            const fileCallbacks = <IFileTreeFileCallbacks> {
                handleFileClick: (clickedFile: FileTreeFileViewModel) => {
                    self.handleFileClick(clickedFile, null);
                }
            };

            return new FileTreeFileViewModel(this._fileManager, fileCallbacks, file);
        });
        const filePromises = files.map((file) => file.init());
        this.files(files);

        // When everything is done, update the status
        await Promise.all([...folderPromises, ...filePromises]);
        this.displayName(folderContents.name);
        this.isExpanded(true);
    }

    // PUBLIC METHODS //////////////////////////////////////////////////////
    public resetSelected(): void {
        // Reset the selected status for all folders under this one
        for (const f of this.folders()) {
            f.resetSelected();
        }

        // Reset the selected status for all files in this folder
        for (const f of this.files()) {
            f.setSelectedStatus(false);
        }
    }

    // EVENT HANDLERS //////////////////////////////////////////////////////
    public handleChevronClick = () => {
        this.isExpanded(!this.isExpanded());
    }

    // CALLBACKS ///////////////////////////////////////////////////////////
    private handleFileClick = (file: FileTreeFileViewModel, folder: FileTreeFolderViewModel) => {
        // Reset the selected status for all folders under this one
        for (const f of this.folders()) {
            if (f === folder) { continue; }
            f.resetSelected();
        }

        // Reset all the files inside this folder
        for (const f of this.files()) {
            f.setSelectedStatus(f === file);
        }

        // Pass the call up the chain
        if (this._browserCallbacks) {
            this._browserCallbacks.handleFileClick(file, this);
        } else {
            this._folderCallbacks.handleFileClick(file, this);
        }
    }
}

export interface IFileTreeFolderBrowserCallbacks {
    handleFileClick(file: FileTreeFileViewModel, folder: FileTreeFolderViewModel): void;
}

export interface IFileTreeFolderFolderCallbacks {
    handleFileClick(file: FileTreeFileViewModel, folder: FileTreeFolderViewModel): void;
}
