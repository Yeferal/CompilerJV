import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SectionService {
  private text3D: string = "";
  private textAssm: string = "";

  private dataSubject = new Subject<number>();
  data$ = this.dataSubject.asObservable();

  private data3dTxtSubject = new Subject<string>();
  data3dTxt$ = this.data3dTxtSubject.asObservable();

  private dataAssmTxtSubject = new Subject<string>();
  dataAssmTxt$ = this.dataAssmTxtSubject.asObservable();

  constructor() { }

  getText3D(): string{
    return this.text3D;
  }

  setText3D(text: string){
    this.text3D = text;
  }

  getTextAssm(): string{
    return this.textAssm;
  }

  setTextAssm(text: string){
    this.textAssm = text;
  }

  sendData(data: number) {
    this.dataSubject.next(data);
  }

  sendData3dTxt(data: string) {
    this.data3dTxtSubject.next(data);
  }

  sendDataAssmTxt(data: string) {
    this.dataAssmTxtSubject.next(data);
  }
  
}
