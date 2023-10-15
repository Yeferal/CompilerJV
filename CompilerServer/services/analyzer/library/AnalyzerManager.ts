import { Parser } from './analyzer-xml';

export class AnalyzerManager {

    runParserLibrary(text: string): any{
        let analizador = new Parser();
        const res = analizador.parse(text);
        return res;
    }

    getProjects(text: string): any{
        let analizador = new Parser();
        const res = analizador.parse(text);
        console.log(res);
        
        return res.listProject;
    }

    getProject(text: string, name: string): any{
        let analizador = new Parser();
        const res = analizador.parse(text);
        const project = res.listProject.find((element) => element.name === name);
        if (project) {
            return project;
        } else {
            return null; // Retorna null si no se encuentra el proyecto
        }
    }

    isExistProject(text: string, name: string): any {
        let analizador = new Parser();
        const res = analizador.parse(text);
    }

}