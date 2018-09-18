import {Event, ipcMain} from "electron";

import {IIpcMessage, IIpcResponse} from "./ipcWrapperMessages";

/**
 * Interface for IPC for the main process
 */
export interface IIpcMainWrapper {
    /**
     * Add handler for a specific event name.
     * @template {TMessage} Type of the message parameters
     * @template {TResponse} Expected type of the response
     * @param event {string} Name of the event to handle
     * @param handler {(param: TMessage) => TResponse} Handler for the message
     */
    on<TMessage, TResponse>(event: string, handler: (param: TMessage) => TResponse): void;

    /**
     * Add handler for specific event name with an async handler
     * @template {TMessage} Type of the message parameters
     * @template {TResponse} Expected type of the response
     * @param eventName {string} Name of the event to handle
     * @param handler {(param: TMessage) => Promise<TResponse>} Handler for the message
     */
    onAsync<TMessage, TResponse>(eventName: string, handler: (param: TMessage) => Promise<TResponse>): void;
}

/**
 * Standard implementation of IIpcRendererWrapper, uses the electron IPC channel
 */
export class IpcMainWrapper implements IIpcMainWrapper {
    /**
     * @inheritDoc
     */
    public on<TMessage, TResponse>(eventName: string, handler: (param: TMessage) => TResponse): void {
        ipcMain.on(eventName, (event: Event, message: IIpcMessage<TMessage>) => {
            let responseMessage: IIpcResponse<TResponse>;
            try {
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

    /**
     * @inheritDoc
     */
    public onAsync<TMessage, TResponse>(eventName: string, handler: (param: TMessage) => Promise<TResponse>): void {
        ipcMain.on(eventName, (event: Event, message: IIpcMessage<TMessage>) => {
            // Call the handle and return the results
            handler(message.param)
                .then(
                    (response) => {
                        return <IIpcResponse<TResponse>> {
                            response: response,
                            success: true
                        };
                    },
                    (error) => {
                        return <IIpcResponse<TResponse>> {
                            error: error,
                            success: false
                        };
                    }
                )
                .then((response) => {
                    const responseEventName = `${eventName}-${message.id}-response`;
                    event.sender.send(responseEventName, response);
                });
        });
    }
}
