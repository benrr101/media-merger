import * as ko from "knockout";
import FileTreeFolderViewModel from "./fileTreeFolderViewModel";
import {IFileManager} from "../models/fileManager";

export default class FileTreeFileViewModel {
    // MEMBER FIELDS ///////////////////////////////////////////////////////
    private readonly _fileManager: IFileManager;
    private readonly _filePath: string;
    private readonly _parent: FileTreeFolderViewModel;

    // OBSERVABLES /////////////////////////////////////////////////////////
    public displayName: KnockoutObservable<string>;
    public filePath: KnockoutObservable<string>;
    public isSelected: KnockoutObservable<boolean>;

    // CONSTRUCTORS ////////////////////////////////////////////////////////
    public constructor(fileManager: IFileManager, parent: FileTreeFolderViewModel, filePath: string) {
        this._fileManager = fileManager;
        this._filePath = filePath;
        this._parent = parent;

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
    }
}

