import { Injectable } from '@angular/core';
import { GLOBAL } from '../core/Global/global';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GeneratedService {

  readonly URL_API = GLOBAL.URL_API;
  headers = new HttpHeaders({
    'Authorization': 'Bearer your-access-token',
    'Custom-Header': 'Custom-Value',
    // 'Content-Type': 'application/json'
  });

  constructor(private http: HttpClient) { }

  postGenTreeDir(data: any){
    return this.http.post<any>(this.URL_API+"/v1.0/generate/code-tree",data, {
      headers: this.headers,
      withCredentials: true,
    });
  }

  postGenTreeAssm(data: any){
    return this.http.post<any>(this.URL_API+"/v1.0/generate/code-assm",data, {
      headers: this.headers,
      withCredentials: true,
    });
  }

  postDownTreeDir(data: any): Observable<HttpResponse<Blob>>{
    // return this.http.post<any>(this.URL_API+"/v1.0/generate/download/code-tree",data, {
    //   responseType: 'blob',
    //   headers: this.headers,
    //   withCredentials: true,
    // });

    return this.http.post(this.URL_API + '/v1.0/generate/download/code-tree', data, {
      responseType: 'blob',
      headers: this.headers,
      observe: 'response',
      withCredentials: true,
    });
  }

  postDownTreeAssm(data: any){
    return this.http.post<any>(this.URL_API+"/v1.0/generate/download/code-assm",data, {
      headers: this.headers,
      withCredentials: true,
    });
  }
}
