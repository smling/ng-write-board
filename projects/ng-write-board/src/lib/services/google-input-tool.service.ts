import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Language } from '../writeboard/language';

@Injectable({
  providedIn: 'root'
})
export class GoogleInputToolService {
  canvasWidth: number | undefined;
  canvasHeight: number | undefined;

  endpoint = "https://www.google.com.tw/inputtools/request?ime=handwriting&app=mobilesearch&cs=1&oe=UTF-8";

  

  constructor(private httpClient: HttpClient) { 
   }

  recognize(trace: any, language: Language) : any{
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
      observe: 'response' as "response", responseType: 'json' as "json"
    };
    const data = JSON.stringify({
      "options": "enable_pre_space",
      "requests": [{
          "writing_guide": {
              "writing_area_width": this.canvasWidth || undefined,
              "writing_area_height": this.canvasHeight || undefined
          },
          "ink": trace,
          "language": language
      }]
    });
  return this.httpClient.post(this.endpoint, data, httpOptions);
  }
}
