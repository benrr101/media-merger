import {dialog} from "electron";

import {IIpcMainWrapper, IpcMainWrapper} from "./utilities/ipcMainWrapper";
import {IpcCalls} from "./constants";

export default class MainIpc {
    private _ipc: IIpcMainWrapper;

    public constructor(ipc: IIpcMainWrapper) {
        this._ipc = ipc;

        const self = this;
        this._ipc.onAsync<undefined, string>(IpcCalls.selectDirectory, (param) => {
            return self.handleSelectDirectoryCall();
        });
    }

    private handleSelectDirectoryCall(): Promise<string> {
        return new Promise<string>((resolve) => {
            dialog.showOpenDialog({properties: ["openDirectory"]}, (filePaths) => {
                if (!filePaths) {
                    resolve(undefined);
                } else {
                    resolve(filePaths[0]);
                }
            });
        });
    }
}
