import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SectionService {
  private dataSubject = new Subject<number>();
  data$ = this.dataSubject.asObservable();

  constructor() { }

  sendData(data: number) {
    this.dataSubject.next(data);
  }

  
}
