import { Component } from '@angular/core';

import { faCoffee, faFileLines, faFileAlt, faFileCode, faCode, faCodeCompare, faLaptopCode, faMicrochip, faList, faTable, faListAlt, faTableList } from '@fortawesome/free-solid-svg-icons';
import { SectionService } from 'src/app/services/section.service';


interface SectionData {
  id: number;
  state: boolean;
}

@Component({
  selector: 'app-directorybar',
  templateUrl: './directorybar.component.html',
  styleUrls: ['./directorybar.component.scss']
})
export class DirectorybarComponent {
  faFiles = faFileCode;
  faCode3D = faCode;
  faCodeOptim = faCodeCompare;
  faCodeAssem = faMicrochip;
  faReport = faTableList;
  // faReport = faTable;

  listSection: Array<SectionData> = [
    {id: 1, state: true},
    {id: 2, state: false},
    {id: 3, state: false},
    {id: 4, state: false},
    {id: 5, state: false}
  ]

  constructor(private sectionService: SectionService){

  }


  changeSection(id: number) {
    this.updateSection(id);
    this.sectionService.sendData(id);
  }

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
