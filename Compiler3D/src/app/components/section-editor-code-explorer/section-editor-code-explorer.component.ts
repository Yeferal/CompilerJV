import { Component } from '@angular/core';
// import { PositionToken } from 'src/app/core/models/mlg/error/position-token';
// import { enterText } from 'src/app/Global/inputText';
import { SectionService } from 'src/app/services/section.service';

interface SectionData {
  id: number;
  state: boolean;
}

@Component({
  selector: 'app-section-editor-code-explorer',
  templateUrl: './section-editor-code-explorer.component.html',
  styleUrls: ['./section-editor-code-explorer.component.scss']
})
export class SectionEditorCodeExplorerComponent {

  row: number = 0;
  column: number = 0;
  parser: any;

  listSection: Array<SectionData> = [
    {id: 1, state: true},
    {id: 2, state: false},
    {id: 3, state: false},
    {id: 4, state: false},
    {id: 5, state: false}
  ]

  constructor(private sectionService: SectionService) {
    // Crea una instancia del parser generado
    // this.parser = Parser;

    this.sectionService.data$.subscribe(
      id => {
        this.updateSection(id);
      }
    );
  }

  ngOnInit() {
    // this.ejecutar();
    // this.evaluateExpression(enterText);
  }

  // evaluateExpression(expression: string): number {
  //   try {
  //     // Evalúa la expresión utilizando el parser
  //     const result: PositionToken = this.parser.parse(expression);
  //     console.log(result.toString());
      
  //     return 1;
  //   } catch (error) {
  //     console.error('Error al evaluar la expresión:', error);
  //     return NaN;
  //   }
  // }

  updateSection(id: number){
    if (id !== -1) {
      // Busca el índice del objeto con el id deseado
      const indexSection = this.listSection.findIndex((item: SectionData) => item.id === id);
      this.listSection[indexSection].state = true;

      this.listSection.forEach((item: SectionData) => {
        if (item.id !== id && item.state === true) {
          item.state = false;
        }
      });
      
    }
  }
  
}
