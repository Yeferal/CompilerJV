import { AnalyzerManager } from "../../services/analyzer/library/AnalyzerManager";
import { FileProject } from "../../services/analyzer/library/FileProject";
import { Library } from "../../services/analyzer/library/Library";
import { Project } from "../../services/analyzer/library/Project";
import { Folder } from "../analyzer/library/Folder";
// const fs = require('fs');
// import { fs } from '../../fs';

export class FileManager {

    analizadorXML = new AnalyzerManager();

    constructor(){}

    //crear un nuevo proyecto
    public createProject(nameProject: string, library: Library): string{
        console.log(nameProject, library);
        
        let texto = '<libreria>\n';
        library.listProject.push(new Project(nameProject, []));
        for(let i = 0; i<library.listProject.length; i++){
            const project = library.listProject[i];
            texto += '\t<proyecto nombre=\"'+project.name+'\">\n';    
            texto += this.generateContent(project.listContent, "\t");
            texto += '\t</proyecto>\n';
        }
        texto += '</libreria>\n';
        console.log(texto);
        return texto;
    }

    //Crear una Carpeta
    public createFolder(library: Library, nameFolder: string, paths: Array<string>): any{
        
        for (let i = 0; i < library.listProject.length; i++) {
            if (library.listProject[i].name == paths[0]) {
                if (paths.length > 1) {
                    this.searchFolder(library.listProject[i].listContent, nameFolder, paths.slice(1))
                } else {
                    let isExist = false
                    for (let j = 0; j < library.listProject[i].listContent.length; j++) {
                        if (library.listProject[i].listContent[j].name == nameFolder && library.listProject[i].listContent[j].type === "folder") {
                            isExist = true;
                            break;
                        }
                    }
                    if (!isExist) {
                        library.listProject[i].listContent.push(new Folder(nameFolder, []))
                    }
                    
                }
            }
        }

        let texto = '<libreria>\n';
        for(let i = 0; i<library.listProject.length; i++){
            const project = library.listProject[i];
            texto += '\t<proyecto nombre=\"'+project.name+'\">\n';    
            texto += this.generateContent(project.listContent, "\t");
            texto += '\t</proyecto>\n';
        }
        texto += '</libreria>\n';
        return texto;
    }

    //Crear una File
    public createFile(library: Library, nameFile: string, paths: Array<string>): any{
        
        for (let i = 0; i < library.listProject.length; i++) {
            if (library.listProject[i].name == paths[0]) {
                if (paths.length > 1) {
                    this.searchFolderFile(library.listProject[i].listContent, nameFile, paths.slice(1))
                } else {
                    let isExist = false
                    for (let j = 0; j < library.listProject[i].listContent.length; j++) {
                        if (library.listProject[i].listContent[j].name == nameFile && library.listProject[i].listContent[j].type === "file") {
                            isExist = true;
                            break;
                        }
                    }
                    if (!isExist) {
                        library.listProject[i].listContent.push(new FileProject(nameFile, nameFile))
                    }
                    
                }
            }
        }

        let texto = '<libreria>\n';
        for(let i = 0; i<library.listProject.length; i++){
            const project = library.listProject[i];
            texto += '\t<proyecto nombre=\"'+project.name+'\">\n';    
            texto += this.generateContent(project.listContent, "\t");
            texto += '\t</proyecto>\n';
        }
        texto += '</libreria>\n';
        return texto;
    }

    searchFolder(listContent: Array<Folder | FileProject>, nameFolder: string, paths: Array<string>){
        for (let i = 0; i < listContent.length; i++) {
            if (listContent[i] instanceof Folder) {
                if (listContent[i].name == paths[0]) {
                    const folder = listContent[i] as Folder;
                    if (paths.length > 1) {
                        this.searchFolder(folder.listContent, nameFolder, paths.slice(1));
                    } else {
                        let isExist = false
                        for (let j = 0; j < folder.listContent.length; j++) {
                            if (folder.listContent[j].name == nameFolder && folder.listContent[j].type === "folder") {
                                isExist = true;
                                break;
                            }
                        }
                        if (!isExist) {
                            folder.listContent.push(new Folder(nameFolder, []));
                        }
                        
                    }
                } 
            }
        }
    }

    searchFolderFile(listContent: Array<Folder | FileProject>, nameFile: string, paths: Array<string>){
        for (let i = 0; i < listContent.length; i++) {
            if (listContent[i] instanceof Folder) {
                if (listContent[i].name == paths[0]) {
                    const folder = listContent[i] as Folder;
                    if (paths.length > 1) {
                        this.searchFolderFile(folder.listContent, nameFile, paths.slice(1));
                    } else {
                        let isExist = false
                        for (let j = 0; j < folder.listContent.length; j++) {
                            if (folder.listContent[j].name == nameFile && folder.listContent[j].type === "file") {
                                isExist = true;
                                break;
                            }
                        }
                        if (!isExist) {
                            folder.listContent.push(new FileProject(nameFile, nameFile));
                        }
                        
                    }
                } 
            }
        }
    }

    private generateContent(listContent: Array<Folder | FileProject>, ident: string): string{
        let texto = "";
        for (let i = 0; i < listContent.length; i++) {
            if (listContent[i] instanceof Folder) {
                const folder = listContent[i] as Folder;
                texto += ident+"\t<carpeta nombre=\""+folder.name+'\">\n';
                texto += this.generateContent(folder.listContent, ident+"\t");
                texto += ident+"\t</carpeta>\n";

            } else if (listContent[i] instanceof FileProject) {
                const fileProject = listContent[i] as FileProject;
                const nameOnly = fileProject.path.split(".");
                texto += ident+"\t<archivo path=\""+nameOnly[0]+"\">";
                texto += fileProject.name;
                texto += "</archivo>\n";
            }
        }
        return texto;
    }

    
    
  
    //guarda un archivo
    public save(nameFile: string){
  
    }
    
    //guarda un archivo con un nuevo nombre
    public saveAs(nameFile: string){
      
    }
  
    //cierra un proyecto
    public closeProject(nameProject: string){
  
    }

    public isExistProject(nameproject: string, library: Library): boolean{
        for(let i = 0; i<library.listProject.length; i++){
            if(library.listProject[i].name==nameproject){
                console.log('Ya existe');
                return true;
            }
        }
        console.log('No existe');
        return false;
    }

    // public isExistFile(nameproject: string, nameFile: string, library: Library): boolean{
    //     for(let i = 0; i<library.listProject.length; i++){
    //         if(library.listProject[i].name==nameproject){
    //             for(let j = 0; j<library.listProject[i].getListFiles.length; j++){
    //                 if(nameFile==library.listProject[i].listContent[j].name){
    //                     console.log('Ya existe file');
    //                     return true;
    //                 }
    //             }
    //         }
    //     }
    //     console.log('No existe file');
    //     return false;
    // }


    

}