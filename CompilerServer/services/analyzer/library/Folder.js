"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Folder = void 0;
var Folder = /** @class */ (function () {
    function Folder(name, listContent) {
        this.listContent = [];
        this.type = "folder";
        this.name = name;
        this.listContent = listContent;
    }
    return Folder;
}());
exports.Folder = Folder;
