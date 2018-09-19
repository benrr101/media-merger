import * as jquery from "jquery";
import * as ko from "knockout";

import RootViewModel from "./viewModels/rootViewModel";

const split = require("split.js");  // Sorry, it has to be loaded this way

// Stuff to run after document is ready
jquery(() => {
    // Initialize split.js splits
    split(["#panel-left", "#panel-center", "#panel-right"], {
        direction: "horizontal",
        elementStyle: (dimension: string, size: number, gutterSize: number) => {
            return {"flex-basis": `calc(${size}% - ${gutterSize}px`};
        },
        gutterSize: 5,
        gutterStyle: (dimension: string, gutterSize: number) => {
            return {"flex-basis": `${gutterSize}px`};
        },
        sizes: [25, 50, 25],
    });

    split(["#panel-center-top", "#panel-center-bottom"], {
        direction: "vertical",
        gutterSize: 5,
        sizes: [50, 50],
    });

    // Initialize knockout app
    (<any> window).rootVm = RootViewModel.createDefault();
    ko.applyBindings((<any> window).rootVm);
});
