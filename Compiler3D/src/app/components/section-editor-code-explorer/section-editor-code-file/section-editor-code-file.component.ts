import { Component, ViewChild } from '@angular/core';
import { CodemirrorComponent } from '@ctrl/ngx-codemirror';
import { enterText } from 'src/app/Global/inputText';
import { NodeDir } from 'src/app/core/models/NodeDir';
import { ErrorType } from 'src/app/core/models/ast/error/ErrorType';
import { ErrorGramm } from 'src/app/core/models/ast/error/error-gramm';
import { PositionToken } from 'src/app/core/models/ast/error/position-token';
import { Environment } from 'src/app/core/models/ast/main/environment/environment';
import { HandlerComprobation } from 'src/app/core/models/ast/main/environment/handler-comprobation';
import { Node } from 'src/app/core/models/ast/main/node';
import { Factory } from 'src/app/core/models/ast/main/tree/Factory';
import { TreeAST } from 'src/app/core/models/ast/main/tree/TreeAST';
import { SectionService } from 'src/app/services/section.service';
import { CursorCode, ShareCodeEditorService } from 'src/app/services/share-code-editor.service';
import { ShareDirService } from 'src/app/services/share-dir.service';
import { ShareProjectService } from 'src/app/services/share-project.service';
import {parser as Parser} from 'src/assets/gramm/main/gramm-main.js'

@Component({
  selector: 'app-section-editor-code-file',
  templateUrl: './section-editor-code-file.component.html',
  styleUrls: ['./section-editor-code-file.component.scss']
})
export class SectionEditorCodeFileComponent {
  @ViewChild('editor') codeMirror: CodemirrorComponent;
  fileSelected: NodeDir;

  // code: string = enterText;
  code: string = "";
  parser: any;
  listTabs: Array<NodeDir> = [];
  actualNode: NodeDir;

  editorConfig = {
    lineNumbers: true,
    // theme: 'material',
    theme: 'darcula', //Este tiene letra mas grande
    // theme: 'ayu-dark',
    // theme: 'material-darker',
    // theme: 'monokai',

    // mode: 'javascript',
    // mode: 'text/x-python',
    mode: 'text/x-java',
    // mode: 'text/x-c++src',
    // mode: 'milenguaje',
    
    // Agrega más opciones de configuración según tus necesidades
  };

  constructor(private shareCodeEditorService: ShareCodeEditorService, 
    private sectionService: SectionService, 
    private shareProject: ShareProjectService,
    private shareDirService: ShareDirService) {
    // Crea una instancia del parser generado
    this.parser = Parser;

    shareDirService.dataNode$.subscribe({
      next: (res) => {
        // this.searchIsExisteNode(res);
      }
    });

    shareProject.dataActual$.subscribe({
      next: res => {
        if (res == null) {
          this.fileSelected = null;
        } else {
          this.fileSelected = res;
          this.code = this.fileSelected.text;
        }
        
      }
    });
  }

  ngOnInit(): void {
    this.fileSelected = this.shareProject.getActualNode();
    this.code = this.fileSelected? this.fileSelected.text : "";
  }

  compile(){
    let result: any;
    try {
      // Evalúa la expresión utilizando el parser
      // console.log(enterText);
      // console.log(ErrorType.LEXICAL);
      
      // const txtEnter = this.codeMirror.codeMirror.getValue();
      const txtEnter = enterText;
      result = this.parser.parse(txtEnter);
      // console.log('Salida: \n',result);

      if (result && result.listError.length>0) {
        //Existen errores
        for (let i = 0; i < result.listError.length; i++) {
          const element: ErrorGramm = result.listError[i] as ErrorGramm;
          console.log(element.toString());
        }
      } else {
        console.log('Salida: \n\n',result);
        // let factory: Factory = new Factory(result, this.shareCodeEditorService);
        // factory.factory();
        // let handlerComprobation: HandlerComprobation = new HandlerComprobation();
        // let listroot = result.listRoot;
        // for (let i = 0; i < listroot.length; i++) {
        //   const element: Node = listroot[i] as Node;
        //   try {
        //     element.executeComprobationTypeNameAmbitUniqueness(handlerComprobation);

        //     handlerComprobation.paintError();
        //   } catch (error) {
        //     console.error(error);
            
        //   }
        // }
        // console.log(handlerComprobation.symbolTable);
        // this.shareCodeEditorService.setSymbolTable(handlerComprobation.symbolTable);
        // this.shareCodeEditorService.setListError(handlerComprobation.listError)
        // let environment: Environment = new Environment();
        // this.sectionService.sendData(5);
      }
      
      return 1;
    } catch (error) {
      // console.log(this.parser.yy.listErrors);
      // console.log(this.parser.yy);
      
      if (result && result.listError.length>0) {
        //Existen errores
        for (let i = 0; i < result.listError.length; i++) {
          const element: ErrorGramm = result.listError[i] as ErrorGramm;
          console.log(element.toString());
        }
      } else {
        const listError = this.parser.yy.listErrors;
        this.shareCodeEditorService.setListError(listError)
      }

      return NaN;
    }
  }

  getCursorPosition(): { line: number; column: number } {
    const cursor = this.codeMirror.codeMirror.getCursor();
    return { line: cursor.line + 1, column: cursor.ch + 1 };
  }

  getCursorCodePosition(): CursorCode {
    const cursor = this.codeMirror.codeMirror.getCursor();
    const cursorCode: CursorCode = {
      row: cursor.line + 1,
      column: cursor.ch + 1
    };
    return cursorCode;
  }

  onEditorChange() {
    this.fileSelected.update = true;
    this.fileSelected.text = this.code;
  }

  onCursorActivity() {
    // console.log(this.getCursorPosition());
    this.sendPositionCursor();
  }

  sendPositionCursor(){
    this.shareCodeEditorService.sendData(this.getCursorCodePosition());
  }
}
