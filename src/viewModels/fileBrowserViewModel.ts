import * as ko from "knockout";

import FileTreeViewModel from "./fileTreeViewModel";
import {IFileManager} from "../models/fileManager";
import {IElectronApiManager} from "../models/electronApiManager";


export default class FileBrowserViewModel {
    // MODELS //////////////////////////////////////////////////////////////
    private _electronApi: IElectronApiManager;
    private _fileManager: IFileManager;

    // CHILD VIEW MODELS ///////////////////////////////////////////////////
    public fileTrees: KnockoutObservableArray<FileTreeViewModel>;

    // OBSERVABLES /////////////////////////////////////////////////////////

    // CONSTRUCTORS ////////////////////////////////////////////////////////
    public constructor(electronApi: IElectronApiManager, fileManager: IFileManager) {
        this._electronApi = electronApi;
        this._fileManager = fileManager;

        this.fileTrees = ko.observableArray<FileTreeViewModel>([]);
    }

    // EVENT HANDLERS //////////////////////////////////////////////////////
    public handleAddFolder = async () => {
        try {
            // Get a directory to read files from it
            const folderToAdd = await this._electronApi.getDirectoryPath();
            const fileTree = await this._fileManager.getFileTree(folderToAdd, true);

            // TEMP: Build a file tree view model from a file tree
            this.fileTrees.push(new FileTreeViewModel(fileTree));
        } catch (e) {
            // TODO: Display error
            console.error(e);
        }
    }
}
