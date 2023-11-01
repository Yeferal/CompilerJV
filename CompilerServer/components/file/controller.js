const colors = require('colors');
const { jsonResponse } = require("../../middleware/json");
const { AnalyzerManager } = require("../../services/analyzer/library/AnalyzerManager");
const { readFile, pathXML, readFileXML, pathLibrary, createFile, createFolder } = require("../../services/file/fsManager");
const { FileManager } = require("../../services/file/FileManager");

const controller = {}

controller.getLibrary = async (req, res) => {
    try {
        const text = await readFileXML();
        console.log("CONTENIDO FILE XML:\n".green,text.blue);
        const analizerManager = new AnalyzerManager();
        const data = analizerManager.runParserLibrary(text);
        const response = jsonResponse(
            'success',
            data,
            'Operacion Existosa',
            null
        );
        return res.json(response);
        
    } catch (error) {
        const response = jsonResponse(
            'error',
            null,
            'Error en la lectura o Parse del Archivo XML',
            {
                code: 500,
                message: 'Error interno del servidor'
            }
        );
        return res.status(500).json(response);
    }
    
}

controller.getProject = async (req, res) => {
    try {
        const nameProject = req.params.name;
        const text = await readFileXML();
        
        const analizerManager = new AnalyzerManager();
        const data = analizerManager.getProject(text, nameProject);
        if (data) {
            const response = jsonResponse(
                'success',
                data,
                'Operacion Existosa',
                null
            );
            return res.json(response);
        }

        const response = jsonResponse(
            'error',
            null,
            'El proyecto no existe',
            {
                code: 404,
                message: 'Error not found'
            }
        );
        return res.json(response);
        
        
    } catch (error) {
        const response = jsonResponse(
            'error',
            null,
            'Error en la lectura o Parse del Archivo XML',
            {
                code: 500,
                message: 'Error interno del servidor'
            }
        );
        return res.status(500).json(response);
    }
}

controller.getProjects = async (req, res) => {
    try {
        const text = await readFileXML();
        const analizerManager = new AnalyzerManager();
        const data = analizerManager.getProjects(text);
        const response = jsonResponse(
            'success',
            data,
            'Operacion Existosa',
            null
        );
        return res.json(response);
        
    } catch (error) {
        const response = jsonResponse(
            'error',
            null,
            'Error en la lectura o Parse del Archivo XML',
            {
                code: 500,
                message: 'Error interno del servidor'
            }
        );
        return res.status(500).json(response);
    }
}

controller.getFileContent = async (req, res) => {
    try {
        const nameFile = req.query.nameFile;
        const path = req.query.path;
        // const text = readFile(pathLibrary+"/"+path+"/"+nameFile);
        const text = readFile(pathLibrary+"/"+path);
        const response = jsonResponse(
            'success',
            text,
            'Operacion Existosa',
            null
        );
        return res.json(response);
    } catch (error) {
        const response = jsonResponse(
            'error',
            null,
            'Error en la lectura o Parse del Archivo XML',
            {
                code: 500,
                message: 'Error interno del servidor'
            }
        );
        return res.status(500).json(response);
    }
}

controller.postProject = async (req, res) => {
    try {
        const nameProject = req.body.name;
        const text = await readFileXML();

        const analizerManager = new AnalyzerManager();
        const data = analizerManager.getProject(text, nameProject);
        
        if (!data) {
            const fileManager = new FileManager();
            const resText = fileManager.createProject(nameProject, analizerManager.runParserLibrary(text));
            console.log(resText);
            await createFile(pathXML, resText);
            createFolder(pathLibrary+"/"+nameProject);
            const data2 = analizerManager.getProject(resText, nameProject);
            const response = jsonResponse(
                'success',
                data2,
                'Se creo exitosamente el proyecto',
                null
            );
            return res.json(response);
        }

        const response = jsonResponse(
            'error',
            null,
            'El proyecto ya existe',
            {
                code: 403,
                message: 'Error not found'
            }
        );
        return res.json(response);
        
        
    } catch (error) {
        const response = jsonResponse(
            'error',
            null,
            'Error en la lectura o Parse del Archivo XML',
            {
                code: 500,
                message: 'Error interno del servidor'
            }
        );
        return res.status(500).json(response);
    }

}

controller.postFolder = async (req, res) => {
    try {
        const nameFolder = req.body.name;
        const path = req.body.path;
        const pathArray = req.body.pathArray;
        const text = await readFileXML();
        const analizerManager = new AnalyzerManager();
        const library = analizerManager.runParserLibrary(text);

        createFolder(pathLibrary+"/"+path+"/"+nameFolder);

        const fileManager = new FileManager();
        const newText = fileManager.createFolder(library, nameFolder, pathArray);
        await createFile(pathXML, newText);
        const data = analizerManager.getProject(newText , pathArray[0]);
        const response = jsonResponse(
            'success',
            data,
            'Se creo exitosamente el proyecto',
            null
        );
        return res.json(response);
        
        
    } catch (error) {
        console.log(error);
        const response = jsonResponse(
            'error',
            null,
            'Error en la lectura o Parse del Archivo XML',
            {
                code: 500,
                message: 'Error interno del servidor'
            }
        );
        return res.status(500).json(response);
    }
}

controller.postFile = async (req, res) => {
    try {
        const nameFile = req.body.name;
        const path = req.body.path;
        const pathArray = req.body.pathArray;
        const text = await readFileXML();
        const analizerManager = new AnalyzerManager();
        const library = analizerManager.runParserLibrary(text);

        createFile(pathLibrary+"/"+path+"/"+nameFile, "");
        //Modifica el XML
        const fileManager = new FileManager();
        const newText = fileManager.createFile(library, nameFile, pathArray);
        console.log(newText);
        await createFile(pathXML, newText);
        const data = analizerManager.getProject(newText , pathArray[0]);
        const response = jsonResponse(
            'success',
            data,
            'Se creo exitosamente el proyecto',
            null
        );
        return res.json(response);
        
    } catch (error) {
        console.log(error);
        const response = jsonResponse(
            'error',
            null,
            'Error en la lectura o Parse del Archivo XML',
            {
                code: 500,
                message: 'Error interno del servidor'
            }
        );
        return res.status(500).json(response);
    }
}

controller.putFileContent = async (req, res) => {
    try {
        // const nameFile = req.params.nameFile;
        const path = req.body.path;
        const text = req.body.text;
        // await createFile(pathLibrary+"/"+path+"/"+nameFile, text);
        await createFile(pathLibrary+"/"+path, text);
        const response = jsonResponse(
            'success',
            true,
            'Se guardo correctamente',
            null
        );
        return res.json(response);
        
        
    } catch (error) {
        const response = jsonResponse(
            'error',
            null,
            'Error en la lectura o Parse del Archivo XML',
            {
                code: 500,
                message: 'Error interno del servidor'
            }
        );
        return res.status(500).json(response);
    }
}

controller.putFileContentAs = async (req, res) => {
    try {
        const nameFile = req.params.nameFile;
        const path = req.body.path;
        const pathArray = req.body.pathArray;
        const textF = req.body.text;
        await createFile(pathLibrary+"/"+path+"/"+nameFile, textF);
        //ACTUALIZAR EL ARCHIVO XML
        const text = await readFileXML();
        const analizerManager = new AnalyzerManager();
        const library = analizerManager.runParserLibrary(text);
        //Modifica el XML
        const fileManager = new FileManager();
        const newText = fileManager.createFile(library, nameFile, pathArray);
        console.log(newText);
        await createFile(pathXML, newText);
        const data = analizerManager.getProject(newText , pathArray[0]);
        const response = jsonResponse(
            'success',
            data,
            'Se creo exitosamente el proyecto',
            null
        );
        return res.json(response);
        
        
    } catch (error) {
        const response = jsonResponse(
            'error',
            null,
            'Error en la lectura o Parse del Archivo XML',
            {
                code: 500,
                message: 'Error interno del servidor'
            }
        );
        return res.status(500).json(response);
    }
}

module.exports = controller;