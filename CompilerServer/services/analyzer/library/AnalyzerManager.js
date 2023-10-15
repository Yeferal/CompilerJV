"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnalyzerManager = void 0;
var analyzer_xml_1 = require("./analyzer-xml");
var AnalyzerManager = /** @class */ (function () {
    function AnalyzerManager() {
    }
    AnalyzerManager.prototype.runParserLibrary = function (text) {
        var analizador = new analyzer_xml_1.Parser();
        var res = analizador.parse(text);
        return res;
    };
    AnalyzerManager.prototype.getProjects = function (text) {
        var analizador = new analyzer_xml_1.Parser();
        var res = analizador.parse(text);
        console.log(res);
        return res.listProject;
    };
    AnalyzerManager.prototype.getProject = function (text, name) {
        var analizador = new analyzer_xml_1.Parser();
        var res = analizador.parse(text);
        var project = res.listProject.find(function (element) { return element.name === name; });
        if (project) {
            return project;
        }
        else {
            return null; // Retorna null si no se encuentra el proyecto
        }
    };
    AnalyzerManager.prototype.isExistProject = function (text, name) {
        var analizador = new analyzer_xml_1.Parser();
        var res = analizador.parse(text);
    };
    return AnalyzerManager;
}());
exports.AnalyzerManager = AnalyzerManager;
