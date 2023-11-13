import { ShareCodeEditorService } from "src/app/services/share-code-editor.service";
import { ErrorType } from "../../error/ErrorType";
import { ErrorGramm } from "../../error/error-gramm";
import { Environment } from "../environment/environment";
import { HandlerComprobation } from "../environment/handler-comprobation";
import { ClassInst } from "../instructions/class-inst";
import { MainNode } from "../instructions/main-node";
import { DynamicDataType } from "../utils/DynamicDataType";
import { TreeAST } from "./TreeAST";
import { ImportNode } from "../import-node";
import { Node } from "../node";
import { TreeDirectoryComponent } from "src/app/components/tree-directory/tree-directory.component";

export interface DataFactory {
    handlerComprobation: HandlerComprobation,
    environment: Environment,
    treeAst?: TreeAST
}

export class Factory {
    
    constructor(public treeAst: TreeAST, public shareCodeEditorService: ShareCodeEditorService, public treeDirectoryComponent: TreeDirectoryComponent){}

    factory(): DataFactory{
        //Inicializar Handler y Enviroment
        
        let handlerComprobation: HandlerComprobation = new HandlerComprobation();
        let environment: Environment = new Environment();
        // console.log(this.treeAst.listRoot);
        
        try {
            this.collectFromTypes(handlerComprobation);
            this.executeComprobations(handlerComprobation);
            handlerComprobation.paintError();
            if (handlerComprobation.listError.length>0) {
                this.treeDirectoryComponent.openModalError("Se encontraron errores en el archivo");
            }
        } catch (error) {
            console.error(error);
            this.treeDirectoryComponent.openModalError("Se encontraron errores en el archivo");
        }

        this.shareCodeEditorService.setSymbolTable(handlerComprobation.symbolTable);
        this.shareCodeEditorService.setTypeTable(handlerComprobation.typeTable);
        this.shareCodeEditorService.setListError(handlerComprobation.listError);

        if (handlerComprobation.listError.length==0) {
            try {
                environment.symbolTable = handlerComprobation.symbolTable;
                environment.typeTable = handlerComprobation.typeTable;
                this.compiler3dFactory(environment);
            } catch (error) {
                console.error(error);
                this.treeDirectoryComponent.openModalError("Se encontraron errores en el archivo");
            }
        }

        return {handlerComprobation, environment};
    }

    /**
     * Recorre los nodos raiz para obtener el nombre de las clases y agregar ese
     * nombre a la tabla de tipos.
     */
    collectFromTypes(handlerComprobation: HandlerComprobation){
        // let handlerComprobation: HandlerComprobation = new HandlerComprobation();
        for (let i = 0; i < this.treeAst.listRoot.length; i++) {
            
            if (this.treeAst.listRoot[i] instanceof ClassInst) {
                const element = this.treeAst.listRoot[i] as ClassInst;
                //Comprobar si no existe uno igual y agregar a la tabla de tipos
                const isExistType = handlerComprobation.typeTable.addType(new DynamicDataType(1, element.name, 1));
                
                if (!isExistType) {
                    const errorGramm = new ErrorGramm(element.positionToken, element.name, `Ya existe una Clase << ${element.name} >>.`, ErrorType.SEMANTIC); 
                    handlerComprobation.listError.push(errorGramm);
                } else {
                    
                }
            }
            
        }
    }

    executeComprobations(handlerComprobation: HandlerComprobation) {
        // Recorre solo las clases
        handlerComprobation.listNode = this.treeAst.listRoot;

        this.executeForImport(handlerComprobation);
    }

    executeForImport(handlerComprobation: HandlerComprobation){
        //Buscando las clases y imports
        for (let i = 0; i < this.treeAst.listRoot.length; i++) {
            if (this.treeAst.listRoot[i] instanceof ClassInst) {
                const classInst = this.treeAst.listRoot[i] as ClassInst;
                if (classInst.listImport!= null && classInst.listImport.length>0) {
                    this.searchForImportClass(handlerComprobation, classInst.listImport);
                }   

                if (!this.treeAst.listRoot[i].isRunning) {
                    handlerComprobation.actualClass = this.treeAst.listRoot[i] as ClassInst;
                    this.treeAst.listRoot[i].executeComprobationTypeNameAmbitUniqueness(handlerComprobation);
                    handlerComprobation.actualClass = null;
                }       
            }
        }

        for (let i = 0; i < this.treeAst.listRoot.length; i++) {
            if (this.treeAst.listRoot[i] instanceof MainNode) {
                const mainNode = this.treeAst.listRoot[i] as MainNode;
                if (mainNode.listImport!= null && mainNode.listImport.length>0) {
                    this.searchForImportClass(handlerComprobation, mainNode.listImport);
                }   
                
                if (!this.treeAst.listRoot[i].isRunning) {
                    this.treeAst.listRoot[i].executeComprobationTypeNameAmbitUniqueness(handlerComprobation);
                }          
            }
        }
    }

    searchForImportClass(handlerComprobation: HandlerComprobation, listImport: Array<ImportNode>){
        for (let i = 0; i < listImport.length; i++) {
            for (let j = 0; j < this.treeAst.listRoot.length; j++) {
                if (this.treeAst.listRoot[j] instanceof ClassInst) {
                    const classInst = this.treeAst.listRoot[j] as ClassInst;
                    if (listImport[i].path.endsWith("*")) {
                        const dirPkg = classInst.packageNode.path;
                        const dirPkgImport = listImport[i].path.slice(0, -1);

                        if (dirPkgImport == dirPkg) {
                            if (!this.treeAst.listRoot[j].isRunning) {
                                if (classInst.listImport!= null && classInst.listImport.length>0) {
                                    this.searchForImportClass(handlerComprobation, classInst.listImport);
                                }  
                                handlerComprobation.actualClass = this.treeAst.listRoot[j] as ClassInst;
                                this.treeAst.listRoot[j].executeComprobationTypeNameAmbitUniqueness(handlerComprobation);
                                handlerComprobation.actualClass = null;
                            }
                        }

                    } else {
                        const dirPkg = classInst.packageNode.path+"."+classInst.name;
                        
                        if (listImport[i].path == dirPkg) {
                            if (!this.treeAst.listRoot[j].isRunning) {
                                if (classInst.listImport!= null && classInst.listImport.length>0) {
                                    this.searchForImportClass(handlerComprobation, classInst.listImport);
                                }  
                                handlerComprobation.actualClass = this.treeAst.listRoot[j] as ClassInst;
                                this.treeAst.listRoot[j].executeComprobationTypeNameAmbitUniqueness(handlerComprobation);
                                handlerComprobation.actualClass = null;
                            }
                        }
                    }
                }
            }
        }
    }


    compiler3dFactory(environment: Environment): Environment{
        for (let i = 0; i < this.treeAst.listRoot.length; i++) {
            if (this.treeAst.listRoot[i] instanceof ClassInst) {
                environment.acutalClass = this.treeAst.listRoot[i] as ClassInst;
                environment.isClass = true;
                this.treeAst.listRoot[i].execute(environment);
                environment.acutalClass = null
                environment.isClass = false;
            }
        }

        // for (let i = 0; i < this.treeAst.listRoot.length; i++) {
        //     if (this.treeAst.listRoot[i] instanceof MainNode) {
        //         this.treeAst.listRoot[i].execute(environment);
        //     }
        // }

        // console.log("Codigo 3d");
        
        // environment.handlerQuartet.paint();

        return environment;
    }

    compiler3dMain(environment: Environment, main: Node): Environment{
        main.execute(environment);
        return environment;
    }

    
}