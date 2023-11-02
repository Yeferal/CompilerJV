import { NodeDir } from "../../../NodeDir";
import {parser as Parser} from 'src/assets/gramm/main/gramm-main.js'
import { TreeAST } from "../tree/TreeAST";
import { empty } from "rxjs";
import { ErrorGramm } from "../../error/error-gramm";
import { ShareCodeEditorService } from "src/app/services/share-code-editor.service";
import { Factory } from "../tree/Factory";

export class HandlerCompiler {

    parser: any;

    constructor(public shareCodeEditorService: ShareCodeEditorService){
        this.parser = Parser;
    }

    compiler(list: Array<NodeDir>){
        
        let listTree: Array<TreeAST> = [];
        let listError: Array<ErrorGramm> = [];
        let treeAST: TreeAST = new TreeAST([], []);
        try {
            
            for (let i = 0; i < list.length; i++) {
                if (list[i].text != null && list[i].text != undefined && list[i].text != "") {
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
                factory.factory();
            }
            
        } catch (error) {
            console.log(error);
            console.log(this.parser.yy.listErrors);
            this.shareCodeEditorService.setListError(this.parser.yy.listErrors);
        }
            
    }
}