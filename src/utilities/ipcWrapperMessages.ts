/**
 * Message to send over the IPC channel
 * @template {TParam} Type of the message's param
 */
export interface IIpcMessage<TParam> {
    /**
     * GUID for the message, used to uniquely process message responses
     */
    id: string;

    /**
     * Parameter to send to the message handler
     */
    param: TParam;
}

/**
 * Message to receive from the IPC channel
 * @template {TResponse} Type of the response's param, must extend Guarded for runtime type safety
 */
export interface IIpcResponse<TResponse> {
    /**
     * If an error occurred during the processing of the message, this property will be set with
     * the error that occurred.
     */
    error: Error|undefined;

    /**
     * If the message was processed successfully, this property will be set with the response
     */
    response: TResponse|undefined;

    /**
     * Whether or not the message was processed successfully
     */
    success: boolean;
}
