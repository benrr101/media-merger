import FileBrowserViewModel from "./fileBrowserViewModel";
import {ElectronApiManager, IElectronApiManager} from "../models/electronApiManager";

export default class RootViewModel {
    // MODELS //////////////////////////////////////////////////////////////
    private _electronApi: IElectronApiManager;

    // CHILD VIEW MODELS ///////////////////////////////////////////////////
    private _fileBrowserViewModel: FileBrowserViewModel;

    // OBSERVABLES /////////////////////////////////////////////////////////

    // CONSTRUCTORS
    public constructor(electronApi: IElectronApiManager) {
        this._electronApi = electronApi;
    }

    public static createDefault(): RootViewModel {
        return new RootViewModel(ElectronApiManager.createDefault());
    }
}
