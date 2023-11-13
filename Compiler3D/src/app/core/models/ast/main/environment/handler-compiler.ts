import { NodeDir } from "../../../NodeDir";
import {parser as Parser} from 'src/assets/gramm/main/gramm-main.js'
import { TreeAST } from "../tree/TreeAST";
import { empty } from "rxjs";
import { ErrorGramm } from "../../error/error-gramm";
import { ShareCodeEditorService } from "src/app/services/share-code-editor.service";
import { DataFactory, Factory } from "../tree/Factory";
import { TreeDirectoryComponent } from "src/app/components/tree-directory/tree-directory.component";
import { MainNode } from "../instructions/main-node";
import { HandlerComprobation } from "./handler-comprobation";

export class HandlerCompiler {

    parser: any;
    treeASTNow: TreeAST = new TreeAST([], []);
    handlerNow: HandlerComprobation;

    constructor(public shareCodeEditorService: ShareCodeEditorService,public treeDirectoryComponent: TreeDirectoryComponent){
        this.parser = Parser;
    }

    compiler(list: Array<NodeDir>){
        
        let listTree: Array<TreeAST> = [];
        let listError: Array<ErrorGramm> = [];
        let treeAST: TreeAST = new TreeAST([], []);
        try {
            
            //Ejecuta el parser para cada archivo
            for (let i = 0; i < list.length; i++) {
                if (list[i].text != null && list[i].text != undefined && list[i].text != "") {
                    this.parser.yy.packageNow = list[i].path;
                    const resTree = this.parser.parse(list[i].text);
                    listTree.push(resTree);
                }
            }

            //Agrega la lista de errore si es que los hay
            for (let i = 0; i < listTree.length; i++) {
                listError.push(...listTree[i].listError);
                treeAST.listRoot.push(...listTree[i].listRoot);
            }

            if (listError.length > 0) {
                // Envia la lista de errores
                this.shareCodeEditorService.setListError(listError);
            } else {
                //No existen errores, empieza ejecutar la fabrica
                let factory: Factory = new Factory(treeAST, this.shareCodeEditorService, this.treeDirectoryComponent);
                let dataFactory = factory.factory();
                dataFactory.treeAst = factory.treeAst;
                this.treeASTNow = treeAST;
                
                
                //Verifica que Main se va a ejecutar
                if (dataFactory.handlerComprobation.listMain.length>0) {
                    this.treeDirectoryComponent.listMains = dataFactory.handlerComprobation.listMain;
                    this.treeDirectoryComponent.dataFactory = dataFactory;
                    this.treeDirectoryComponent.openModal();
                } else {
                    this.treeDirectoryComponent.listMains = [];
                    this.treeDirectoryComponent.dataFactory = dataFactory;
                }
                
            }
            
        } catch (error) {
            console.log(error);
            console.log(this.parser.yy.listErrors);
            this.shareCodeEditorService.setListError(this.parser.yy.listErrors);
            this.treeDirectoryComponent.openModalError("Se encontraron errores en el archivo");
        }
            
    }

    compiler3D(mainNode: MainNode, dataFactory: DataFactory){
        let factory: Factory = new Factory(this.treeASTNow, this.shareCodeEditorService, this.treeDirectoryComponent);
        dataFactory.environment = factory.compiler3dMain(dataFactory.environment, mainNode);
    }
}