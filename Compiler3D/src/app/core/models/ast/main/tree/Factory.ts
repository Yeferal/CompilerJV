import { ShareCodeEditorService } from "src/app/services/share-code-editor.service";
import { ErrorType } from "../../error/ErrorType";
import { ErrorGramm } from "../../error/error-gramm";
import { Environment } from "../environment/environment";
import { HandlerComprobation } from "../environment/handler-comprobation";
import { ClassInst } from "../instructions/class-inst";
import { MainNode } from "../instructions/main-node";
import { DynamicDataType } from "../utils/DynamicDataType";
import { TreeAST } from "./TreeAST";

export class Factory {
    
    constructor(public treeAst: TreeAST, public shareCodeEditorService: ShareCodeEditorService){}

    factory(){
        //Inicializar Handler y Enviroment
        let handlerComprobation: HandlerComprobation = new HandlerComprobation();
        let environment: Environment = new Environment();
        try {
            this.collectFromTypes(handlerComprobation);
            this.executeComprobations(handlerComprobation);
            handlerComprobation.paintError();
        } catch (error) {
            console.error(error);
        }

        this.shareCodeEditorService.setSymbolTable(handlerComprobation.symbolTable);
        this.shareCodeEditorService.setTypeTable(handlerComprobation.typeTable);
        this.shareCodeEditorService.setListError(handlerComprobation.listError);
        
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
        for (let i = 0; i < this.treeAst.listRoot.length; i++) {
            if (this.treeAst.listRoot[i] instanceof ClassInst) {
                if (!this.treeAst.listRoot[i].isRunning) {
                    handlerComprobation.actualClass = this.treeAst.listRoot[i] as ClassInst;
                    this.treeAst.listRoot[i].executeComprobationTypeNameAmbitUniqueness(handlerComprobation);
                }
            }
            
        }
        //Recorre solo los archivo main
        for (let i = 0; i < this.treeAst.listRoot.length; i++) {
            if (this.treeAst.listRoot[i] instanceof MainNode) {
                    this.treeAst.listRoot[i].executeComprobationTypeNameAmbitUniqueness(handlerComprobation);
            }
            
        }
    }
    
}