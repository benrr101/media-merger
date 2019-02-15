import * as ko from "knockout";

import {IFileManager} from "../models/fileManager";

export class FileTreeFileViewModel {
    // MEMBER FIELDS ///////////////////////////////////////////////////////
    private readonly _callbacks: IFileTreeFileCallbacks;
    private readonly _fileManager: IFileManager;
    private readonly _filePath: string;

    // OBSERVABLES /////////////////////////////////////////////////////////
    public displayName: KnockoutObservable<string>;
    public filePath: KnockoutObservable<string>;
    public isSelected: KnockoutObservable<boolean>;

    // CONSTRUCTORS ////////////////////////////////////////////////////////
    public constructor(fileManager: IFileManager, callbacks: IFileTreeFileCallbacks, filePath: string) {
        this._callbacks = callbacks;
        this._fileManager = fileManager;
        this._filePath = filePath;

        this.displayName = ko.observable<string>("Loading...");
        this.filePath = ko.observable<string>(this._filePath);
        this.isSelected = ko.observable<boolean>(false);
    }

    public init = async (): Promise<void> => {
        const fileInformation = await this._fileManager.getFileInformation(this._filePath);
        this.displayName(fileInformation.name);
    }

    // EVENT HANDLER ///////////////////////////////////////////////////////
    public handleClick = () => {
        // Mark the file as selected and bubble the request up the stack
        this.isSelected(true);

        this._callbacks.handleFileSelected(this);
    }
}

export interface IFileTreeFileCallbacks {
    handleFileSelected: (file: FileTreeFileViewModel) => void;
}

