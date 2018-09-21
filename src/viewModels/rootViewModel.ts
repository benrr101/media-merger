import * as ko from "knockout";

import FileBrowserViewModel from "./fileBrowserViewModel";
import {ElectronApiManager, IElectronApiManager} from "../models/electronApiManager";

export default class RootViewModel {
    // MODELS //////////////////////////////////////////////////////////////
    private _electronApi: IElectronApiManager;

    // CHILD VIEW MODELS ///////////////////////////////////////////////////
    public fileBrowserViewModel: KnockoutObservable<FileBrowserViewModel>;

    // OBSERVABLES /////////////////////////////////////////////////////////
    public activePane: KnockoutObservable<string>;

    // CONSTRUCTORS ////////////////////////////////////////////////////////
    public constructor(electronApi: IElectronApiManager) {
        // Models
        this._electronApi = electronApi;

        // Child viewmodels
        this.fileBrowserViewModel = ko.observable<FileBrowserViewModel>(new FileBrowserViewModel(this._electronApi));

        // Observables
        this.activePane = ko.observable("tv");
    }

    public static createDefault(): RootViewModel {
        return new RootViewModel(ElectronApiManager.createDefault());
    }
}
