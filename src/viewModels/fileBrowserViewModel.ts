import * as ko from "knockout";

import {FileTreeFileViewModel} from "./fileTreeFileViewModel";
import {IFileTreeFolderCallbacks, FileTreeFolderViewModel} from "./fileTreeFolderViewModel";
import {IFileManager} from "../models/fileManager";
import {IElectronApiManager} from "../models/electronApiManager";

export class FileBrowserViewModel {
    // MODELS //////////////////////////////////////////////////////////////
    private readonly _callbacks: IFileBrowserCallbacks;
    private readonly _fileManager: IFileManager;
    private readonly _electronApi: IElectronApiManager;

    // CHILD VIEW MODELS ///////////////////////////////////////////////////
    public fileTrees: KnockoutObservableArray<FileTreeFolderViewModel>;

    // CONSTRUCTORS ////////////////////////////////////////////////////////
    public constructor(electronApi: IElectronApiManager, fileManager: IFileManager, callbacks: IFileBrowserCallbacks) {
        this._callbacks = callbacks;
        this._electronApi = electronApi;
        this._fileManager = fileManager;

        this.fileTrees = ko.observableArray<FileTreeFolderViewModel>([]);
    }

    // EVENT HANDLERS //////////////////////////////////////////////////////
    public handleClickAddFolder = async () => {
        try {
            // Get a directory
            const folderToAdd = await this._electronApi.getDirectoryPath();
            if (!folderToAdd) {
                return;
            }

            // Generate the root of the tree and kick off recursive initialization
            const callbacks = <IFileTreeFolderCallbacks> {
                setSelectedFile: this.handleFileSelected
            };
            const folderViewModel = new FileTreeFolderViewModel(this._fileManager, callbacks, folderToAdd);
            this.fileTrees.push(folderViewModel);
            folderViewModel.init();
        } catch (e) {
            // TODO: Display error
            console.error(e);
        }
    }

    public handleClickCloseFolder = async (folderToClose: FileTreeFolderViewModel) => {
        try {
            // @TODO: If there are pending changes, ask the user if they want to close

            // Close the folder
            this.fileTrees.remove(folderToClose);
        } catch (e) {
            // TODO: Display error
            console.error(e);
        }
    }

    // CALLBACKS ///////////////////////////////////////////////////////////
    public handleFileSelected = (file: FileTreeFileViewModel) => {
        // Reset all the files under here
        // TODO: Reset all files underneath

        // Set the active file in the root view model
        this._callbacks.setSelectedFile(file);
    }
}

export interface IFileBrowserCallbacks {
    setSelectedFile(file: FileTreeFileViewModel): void;
}
