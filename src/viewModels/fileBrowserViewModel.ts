import * as ko from "knockout";

import FileTreeFolderViewModel from "./fileTreeFolderViewModel";
import {IFileManager} from "../models/fileManager";
import {IElectronApiManager} from "../models/electronApiManager";


export default class FileBrowserViewModel {
    // MODELS //////////////////////////////////////////////////////////////
    private readonly _fileManager: IFileManager;
    private readonly _electronApi: IElectronApiManager;

    // CHILD VIEW MODELS ///////////////////////////////////////////////////
    public fileTrees: KnockoutObservableArray<FileTreeFolderViewModel>;

    // OBSERVABLES /////////////////////////////////////////////////////////

    // CONSTRUCTORS ////////////////////////////////////////////////////////
    public constructor(electronApi: IElectronApiManager, fileManager: IFileManager) {
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
            const folderViewModel = new FileTreeFolderViewModel(this._fileManager, folderToAdd);
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
}
