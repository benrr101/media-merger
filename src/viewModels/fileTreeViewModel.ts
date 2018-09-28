import * as ko from "knockout";

import {FileTree} from "../models/fileManager";

export default class FileTreeViewModel {
    // CHILD VIEWMODELS ////////////////////////////////////////////////////
    public children: KnockoutObservableArray<FileTreeViewModel>;

    // OBSERVABLES /////////////////////////////////////////////////////////
    public isExpanded: KnockoutObservable<boolean>;
    public name: KnockoutObservable<string>;

    // CONSTRUCTORS ////////////////////////////////////////////////////////
    public constructor(tree: FileTree) {
        this.children = ko.observableArray<FileTreeViewModel>([]);

        this.isExpanded = ko.observable<boolean>(true);
        this.name = ko.observable(tree.name);
    }

    // EVENT HANDLERS //////////////////////////////////////////////////////
    public handleChevronClick = () => {
        this.isExpanded(!this.isExpanded());
    }
}
