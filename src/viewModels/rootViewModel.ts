import * as ko from "knockout";

import {IFileBrowserCallbacks, FileBrowserViewModel} from "./fileBrowserViewModel";
import {ElectronApiManager, IElectronApiManager} from "../models/electronApiManager";
import {FileManager, IFileManager} from "../models/fileManager";
import {FileTreeFileViewModel} from "./fileTreeFileViewModel";

export default class RootViewModel {
    // MODELS //////////////////////////////////////////////////////////////
    private readonly _electronApi: IElectronApiManager;
    private readonly _fileManager: IFileManager;

    // CHILD VIEW MODELS ///////////////////////////////////////////////////
    public activeFile: KnockoutObservable<FileTreeFileViewModel>;
    public fileBrowserViewModel: KnockoutObservable<FileBrowserViewModel>;

    // OBSERVABLES /////////////////////////////////////////////////////////
    public activePane: KnockoutObservable<string>;

    // CONSTRUCTORS ////////////////////////////////////////////////////////
    public constructor(electronApi: IElectronApiManager, fileManager: IFileManager) {
        // Models
        this._electronApi = electronApi;
        this._fileManager = fileManager;

        // Child viewmodels
        this.activeFile = ko.observable<FileTreeFileViewModel>();

        const browserCallbacks = <IFileBrowserCallbacks> {
            setSelectedFile: this.setSelectedFile
        };
        const fileBrowserVM = new FileBrowserViewModel(this._electronApi, this._fileManager, browserCallbacks);
        this.fileBrowserViewModel = ko.observable<FileBrowserViewModel>(fileBrowserVM);

        // Observables
        this.activePane = ko.observable("tv");
    }

    public static createDefault(): RootViewModel {
        return new RootViewModel(ElectronApiManager.createDefault(), new FileManager());
    }

    // CALLBACKS ///////////////////////////////////////////////////////////
    private setSelectedFile = (file: FileTreeFileViewModel): void => {
        this.activeFile(file);
    }
}
