import { Injectable } from '@angular/core';
import { GLOBAL } from '../core/Global/global';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FilesService {

  readonly URL_API = GLOBAL.URL_API;
  headers = new HttpHeaders({
    'Authorization': 'Bearer your-access-token',
    'Custom-Header': 'Custom-Value',
    // 'Content-Type': 'application/json'
  });

  private dataGen3DSubject = new Subject<boolean>();
  dataGen3D$ = this.dataGen3DSubject.asObservable();

  private dataGenAssemSubject = new Subject<boolean>();
  dataGenAssem$ = this.dataGenAssemSubject.asObservable();

  private dataDow3DSubject = new Subject<boolean>();
  dataDow3D$ = this.dataDow3DSubject.asObservable();

  private dataDowAssemSubject = new Subject<boolean>();
  dataDowAssem$ = this.dataDowAssemSubject.asObservable();

  constructor(private http: HttpClient) { }

  sendGen3D(){
    this.dataGen3DSubject.next(true);
  }

  sendGenAssem(){
    this.dataGenAssemSubject.next(true);
  }

  sendDow3D(){
    this.dataDow3DSubject.next(true);
  }

  sendDowAssem(){
    this.dataDowAssemSubject.next(true);
  }

  getLibrary(){
    return this.http.get<any>(this.URL_API+"/v1.0/files", {
      headers: this.headers,
      withCredentials: true
    });
  }

  getProjects(){
    return this.http.get<any>(this.URL_API+"/v1.0/files/projects", {
      headers: this.headers,
      withCredentials: true
    });
  }

  getProject(name: string){
    return this.http.get<any>(this.URL_API+"/v1.0/files/project/"+name, {
      headers: this.headers,
      withCredentials: true
    });
  }

  getFileContent(path: string){
    return this.http.get<any>(this.URL_API+"/v1.0/files/file-content", {
      headers: this.headers,
      withCredentials: true,
      params: {path}
    });
    // return this.http.get<any>(this.URL_API+"/v1.0/files/file-content/"+path, {
    //   headers: this.headers,
    //   withCredentials: true
    // });
  }

  postProject(data: any){
    return this.http.post<any>(this.URL_API+"/v1.0/files/project", data, {
      headers: this.headers,
      withCredentials: true
    });
  }

  postDir(data: any){
    return this.http.post<any>(this.URL_API+"/v1.0/files/folder", data, {
      headers: this.headers,
      withCredentials: true
    });
  }

  postFile(data: any){
    return this.http.post<any>(this.URL_API+"/v1.0/files/file", data, {
      headers: this.headers,
      withCredentials: true
    });
  }

  putContetFile(data: any){
    return this.http.put<any>(this.URL_API+`/v1.0/files/file-content`, data, {
      headers: this.headers,
      withCredentials: true,
    });
  }

  putContetFileAs(nameFile: string,data: any){
    return this.http.post<any>(this.URL_API+`/v1.0/files/file-contentAs/${nameFile}`, data, {
      headers: this.headers,
      withCredentials: true
    });
  }
}
