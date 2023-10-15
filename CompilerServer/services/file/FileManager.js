"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileManager = void 0;
var AnalyzerManager_1 = require("../../services/analyzer/library/AnalyzerManager");
var FileProject_1 = require("../../services/analyzer/library/FileProject");
var Project_1 = require("../../services/analyzer/library/Project");
var Folder_1 = require("../analyzer/library/Folder");
// const fs = require('fs');
// import { fs } from '../../fs';
var FileManager = /** @class */ (function () {
    function FileManager() {
        this.analizadorXML = new AnalyzerManager_1.AnalyzerManager();
    }
    //crear un nuevo proyecto
    FileManager.prototype.createProject = function (nameProject, library) {
        console.log(nameProject, library);
        var texto = '<libreria>\n';
        library.listProject.push(new Project_1.Project(nameProject, []));
        for (var i = 0; i < library.listProject.length; i++) {
            var project = library.listProject[i];
            texto += '\t<proyecto nombre=\"' + project.name + '\">\n';
            texto += this.generateContent(project.listContent, "\t");
            texto += '\t</proyecto>\n';
        }
        texto += '</libreria>\n';
        console.log(texto);
        return texto;
    };
    //Crear una Carpeta
    FileManager.prototype.createFolder = function (library, nameFolder, paths) {
        for (var i = 0; i < library.listProject.length; i++) {
            if (library.listProject[i].name == paths[0]) {
                if (paths.length > 1) {
                    this.searchFolder(library.listProject[i].listContent, nameFolder, paths.slice(1));
                }
                else {
                    var isExist = false;
                    for (var j = 0; j < library.listProject[i].listContent.length; j++) {
                        if (library.listProject[i].listContent[j].name == nameFolder && library.listProject[i].listContent[j].type === "folder") {
                            isExist = true;
                            break;
                        }
                    }
                    if (!isExist) {
                        library.listProject[i].listContent.push(new Folder_1.Folder(nameFolder, []));
                    }
                }
            }
        }
        var texto = '<libreria>\n';
        for (var i = 0; i < library.listProject.length; i++) {
            var project = library.listProject[i];
            texto += '\t<proyecto nombre=\"' + project.name + '\">\n';
            texto += this.generateContent(project.listContent, "\t");
            texto += '\t</proyecto>\n';
        }
        texto += '</libreria>\n';
        return texto;
    };
    //Crear una File
    FileManager.prototype.createFile = function (library, nameFile, paths) {
        for (var i = 0; i < library.listProject.length; i++) {
            if (library.listProject[i].name == paths[0]) {
                if (paths.length > 1) {
                    this.searchFolderFile(library.listProject[i].listContent, nameFile, paths.slice(1));
                }
                else {
                    var isExist = false;
                    for (var j = 0; j < library.listProject[i].listContent.length; j++) {
                        if (library.listProject[i].listContent[j].name == nameFile && library.listProject[i].listContent[j].type === "file") {
                            isExist = true;
                            break;
                        }
                    }
                    if (!isExist) {
                        library.listProject[i].listContent.push(new FileProject_1.FileProject(nameFile, nameFile));
                    }
                }
            }
        }
        var texto = '<libreria>\n';
        for (var i = 0; i < library.listProject.length; i++) {
            var project = library.listProject[i];
            texto += '\t<proyecto nombre=\"' + project.name + '\">\n';
            texto += this.generateContent(project.listContent, "\t");
            texto += '\t</proyecto>\n';
        }
        texto += '</libreria>\n';
        return texto;
    };
    FileManager.prototype.searchFolder = function (listContent, nameFolder, paths) {
        for (var i = 0; i < listContent.length; i++) {
            if (listContent[i] instanceof Folder_1.Folder) {
                if (listContent[i].name == paths[0]) {
                    var folder = listContent[i];
                    if (paths.length > 1) {
                        this.searchFolder(folder.listContent, nameFolder, paths.slice(1));
                    }
                    else {
                        var isExist = false;
                        for (var j = 0; j < folder.listContent.length; j++) {
                            if (folder.listContent[j].name == nameFolder && folder.listContent[j].type === "folder") {
                                isExist = true;
                                break;
                            }
                        }
                        if (!isExist) {
                            folder.listContent.push(new Folder_1.Folder(nameFolder, []));
                        }
                    }
                }
            }
        }
    };
    FileManager.prototype.searchFolderFile = function (listContent, nameFile, paths) {
        for (var i = 0; i < listContent.length; i++) {
            if (listContent[i] instanceof Folder_1.Folder) {
                if (listContent[i].name == paths[0]) {
                    var folder = listContent[i];
                    if (paths.length > 1) {
                        this.searchFolderFile(folder.listContent, nameFile, paths.slice(1));
                    }
                    else {
                        var isExist = false;
                        for (var j = 0; j < folder.listContent.length; j++) {
                            if (folder.listContent[j].name == nameFile && folder.listContent[j].type === "file") {
                                isExist = true;
                                break;
                            }
                        }
                        if (!isExist) {
                            folder.listContent.push(new FileProject_1.FileProject(nameFile, nameFile));
                        }
                    }
                }
            }
        }
    };
    FileManager.prototype.generateContent = function (listContent, ident) {
        var texto = "";
        for (var i = 0; i < listContent.length; i++) {
            if (listContent[i] instanceof Folder_1.Folder) {
                var folder = listContent[i];
                texto += ident + "\t<carpeta nombre=\"" + folder.name + '\">\n';
                texto += this.generateContent(folder.listContent, ident + "\t");
                texto += ident + "\t</carpeta>\n";
            }
            else if (listContent[i] instanceof FileProject_1.FileProject) {
                var fileProject = listContent[i];
                var nameOnly = fileProject.path.split(".");
                texto += ident + "\t<archivo path=\"" + nameOnly[0] + "\">";
                texto += fileProject.name;
                texto += "</archivo>\n";
            }
        }
        return texto;
    };
    //guarda un archivo
    FileManager.prototype.save = function (nameFile) {
    };
    //guarda un archivo con un nuevo nombre
    FileManager.prototype.saveAs = function (nameFile) {
    };
    //cierra un proyecto
    FileManager.prototype.closeProject = function (nameProject) {
    };
    FileManager.prototype.isExistProject = function (nameproject, library) {
        for (var i = 0; i < library.listProject.length; i++) {
            if (library.listProject[i].name == nameproject) {
                console.log('Ya existe');
                return true;
            }
        }
        console.log('No existe');
        return false;
    };
    return FileManager;
}());
exports.FileManager = FileManager;
