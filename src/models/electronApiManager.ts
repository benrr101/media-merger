import {IIpcRendererWrapper, IpcRendererWrapper} from "../utilities/ipcRendererWrapper";
import {IpcCalls} from "../constants";

export interface IElectronApiManager {
    getDirectoryPath(): Promise<string|null>;
}

export class ElectronApiManager implements IElectronApiManager {
    private _ipc: IIpcRendererWrapper;

    constructor(ipc: IIpcRendererWrapper) {
        this._ipc = ipc;
    }

    public static createDefault(): ElectronApiManager {
        return new ElectronApiManager(new IpcRendererWrapper());
    }

    public getDirectoryPath(): Promise<string> {
        return this._ipc.sendAsync<undefined, string>(IpcCalls.selectDirectory, undefined);
    }
}
