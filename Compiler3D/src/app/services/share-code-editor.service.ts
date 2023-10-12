import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

export interface CursorCode {
  row: number;
  column: number;
}


@Injectable({
  providedIn: 'root'
})
export class ShareCodeEditorService {
  private dataSubject = new Subject<CursorCode>();
  data$ = this.dataSubject.asObservable();

  constructor() { }

  sendData(data: CursorCode) {
    this.dataSubject.next(data);
  }

}
