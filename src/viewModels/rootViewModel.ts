import * as ko from "knockout";

import FileBrowserViewModel from "./fileBrowserViewModel";
import {ElectronApiManager, IElectronApiManager} from "../models/electronApiManager";
import {FileManager, IFileManager} from "../models/fileManager";

export default class RootViewModel {
    // MODELS //////////////////////////////////////////////////////////////
    private readonly _electronApi: IElectronApiManager;
    private readonly _fileManager: IFileManager;

    // CHILD VIEW MODELS ///////////////////////////////////////////////////
    public fileBrowserViewModel: KnockoutObservable<FileBrowserViewModel>;

    // OBSERVABLES /////////////////////////////////////////////////////////
    public activePane: KnockoutObservable<string>;

    // CONSTRUCTORS ////////////////////////////////////////////////////////
    public constructor(electronApi: IElectronApiManager, fileManager: IFileManager) {
        // Models
        this._electronApi = electronApi;
        this._fileManager = fileManager;

        // Child viewmodels
        const fileBrowserVM = new FileBrowserViewModel(this._electronApi, this._fileManager);
        this.fileBrowserViewModel = ko.observable<FileBrowserViewModel>(fileBrowserVM);

        // Observables
        this.activePane = ko.observable("tv");
    }

    public static createDefault(): RootViewModel {
        return new RootViewModel(ElectronApiManager.createDefault(), new FileManager());
    }
}
