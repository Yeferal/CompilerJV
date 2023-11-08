import { NodeDir } from "../../../NodeDir";
import {parser as Parser} from 'src/assets/gramm/main/gramm-main.js'
import { TreeAST } from "../tree/TreeAST";
import { empty } from "rxjs";
import { ErrorGramm } from "../../error/error-gramm";
import { ShareCodeEditorService } from "src/app/services/share-code-editor.service";
import { Factory } from "../tree/Factory";
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
            
            for (let i = 0; i < list.length; i++) {
                if (list[i].text != null && list[i].text != undefined && list[i].text != "") {
                    this.parser.yy.packageNow = list[i].path;
                    const resTree = this.parser.parse(list[i].text);
                    listTree.push(resTree);
                }
            }

            for (let i = 0; i < listTree.length; i++) {
                listError.push(...listTree[i].listError);
                treeAST.listRoot.push(...listTree[i].listRoot);
            }

            if (listError.length > 0) {
                this.shareCodeEditorService.setListError(listError);
            } else {
                let factory: Factory = new Factory(treeAST, this.shareCodeEditorService);
                let handlerCompiler = factory.factory();
                this.handlerNow = handlerCompiler;
                this.treeASTNow = treeAST;
                
                if (handlerCompiler.listMain.length>1) {
                    this.treeDirectoryComponent.listMains = handlerCompiler.listMain;
                    this.treeDirectoryComponent.openModal();
                } else {
                    this.compiler3D(handlerCompiler.listMain[0]);
                }
                
            }
            
        } catch (error) {
            console.log(error);
            console.log(this.parser.yy.listErrors);
            this.shareCodeEditorService.setListError(this.parser.yy.listErrors);
        }
            
    }

    compiler3D(mainNode: MainNode){
        let factory: Factory = new Factory(this.treeASTNow, this.shareCodeEditorService);
    }
}