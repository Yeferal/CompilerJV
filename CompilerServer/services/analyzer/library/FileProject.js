"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileProject = void 0;
var FileProject = /** @class */ (function () {
    function FileProject(path, name) {
        this.type = "file";
        this.path = path;
        this.name = name;
    }
    return FileProject;
}());
exports.FileProject = FileProject;
