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
    public handleAddFolder = async () => {
        try {
            // Get a directory to read files from it
            const folderToAdd = await this._electronApi.getDirectoryPath();
            this.fileTrees.push(new FileTreeFolderViewModel(this._fileManager, folderToAdd));
        } catch (e) {
            // TODO: Display error
            console.error(e);
        }
    }
}
