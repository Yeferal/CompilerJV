import { Injectable } from '@angular/core';
import { GLOBAL } from '../core/Global/global';
import { HttpClient, HttpHeaders } from '@angular/common/http';

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

  constructor(private http: HttpClient) { }

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
    return this.http.get<any>(this.URL_API+"/v1.0/files/file-content/"+path, {
      headers: this.headers,
      withCredentials: true
    });
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

  putContetFile(nameFile: string,data: any){
    return this.http.post<any>(this.URL_API+`/v1.0/files/file-content/${nameFile}`, data, {
      headers: this.headers,
      withCredentials: true
    });
  }

  putContetFileAs(nameFile: string,data: any){
    return this.http.post<any>(this.URL_API+`/v1.0/files/file-contentAs/${nameFile}`, data, {
      headers: this.headers,
      withCredentials: true
    });
  }
}
