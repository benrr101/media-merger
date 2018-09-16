import * as uuid from "uuid/v4";
import {ipcRenderer} from "electron";

import Guarded from "./guarded";
import {IIpcMessage, IIpcResponse} from "./ipcWrapperMessages";

/**
 * Interface for IPC for the renderer process
 */
export interface IIpcRendererWrapper {
    /**
     * Sends an message to the main process via IPC. Asynchronously waits for message
     * @template {TMessage} Type of the message parameters
     * @template {TResponse} Expected type of the response
     * @param event {string} Name of the event to send
     * @param param {TMessage} Parameter to send in the mssage
     * @return {Promise<TResponse>}
     */
    sendAsync<TMessage extends Guarded<TMessage>, TResponse extends Guarded<TResponse>>(
        event: string, param: TMessage
    ): Promise<TResponse>;
}

/**
 * Standard implementation of IIpcRendererWrapper, uses the electron IPC channel
 */
export class IpcRendererWrapper implements IIpcRendererWrapper {
    /**
     * @inheritDoc
     */
    public sendAsync<TMessage extends Guarded<TMessage>, TResponse extends Guarded<TResponse>>(
        event: string, param: TMessage
    ): Promise<TResponse> {
        return new Promise<TResponse>((resolve, reject) => {
            // UUID to identify this specific message
            const messageUuid = uuid();

            // Create a handler for the response
            const responseEvent = `${event}-${uuid}-response`;
            ipcRenderer.once(responseEvent, (e: string, m: IIpcResponse<TResponse>) => {
                if (m.success) {
                    resolve(m.response);
                } else {
                    reject();
                }
            });

            // Construct and send the message
            const message = <IIpcMessage<TMessage>> {
                id: messageUuid,
                param: param
            };
            ipcRenderer.send(event, message);
        });
    }
}