import * as ko from "knockout";

import {IElectronApiManager} from "../models/electronApiManager";

export default class FileBrowserViewModel {
    // MODELS //////////////////////////////////////////////////////////////
    private _electronApi: IElectronApiManager;

    // OBSERVABLES /////////////////////////////////////////////////////////


    // CONSTRUCTORS ////////////////////////////////////////////////////////
    public constructor(electronApi: IElectronApiManager) {
        this._electronApi = electronApi;
    }

    // EVENT HANDLERS //////////////////////////////////////////////////////
    public handleAddFolder = async () => {
        console.log(await this._electronApi.getDirectoryPath());
    }
}
