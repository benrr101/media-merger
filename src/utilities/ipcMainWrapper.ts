import {Event, ipcMain} from "electron";

import Guarded from "./guarded";
import {IIpcMessage, IIpcResponse} from "./ipcWrapperMessages";

/**
 * Interface for IPC for the main process
 */
export interface IIpcMainWrapper {
    /**
     * @template {TMessage} Type of the message parameters
     * @template {TResponse} Expected type of the response
     * @param event {string} Name of the event to handle
     * @param handler {(param: TMessage) => TResponse} Handler for the message
     */
    on<TMessage extends Guarded<TMessage>, TResponse extends Guarded<TResponse>>(
        event: string, handler: (param: TMessage) => TResponse
    ): void;
}

/**
 * Standard implementation of IIpcRendererWrapper, uses the electron IPC channel
 */
export class IpcMainWrapper implements IIpcMainWrapper {
    /**
     * @inheritDoc
     */
    public on<TMessage extends Guarded<TMessage>, TResponse extends Guarded<TResponse>>(
        eventName: string, handler: (param: TMessage) => TResponse
    ): void {
        ipcMain.on(eventName, (event: Event, message: IIpcMessage<TMessage>) => {
            let responseMessage: IIpcResponse<TResponse>;
            try {
                // Make sure that the input matches the types we expected
                if (!message.param.IsType<TMessage>()) {
                    throw new Error(`Message parameter for event [${event}] is not ${nameof<TMessage>()}`);
                }

                // Call the handler and return the results
                const response = handler(message.param);
                responseMessage = <IIpcResponse<TResponse>> {
                    response: response,
                    success: true
                };
            } catch (e) {
                // Handler or something else failed, return the error
                responseMessage = <IIpcResponse<TResponse>> {
                    error: e,
                    success: false
                };
            }

            const responseEventName = `${eventName}-${message.id}-response`;
            event.sender.send(responseEventName, responseMessage);
        });
    }
}
