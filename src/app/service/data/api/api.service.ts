import {Inject, Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private _tokenHeader;

  constructor(private _http: HttpClient, @Inject('BASE_URL') private _baseUrl: string) {
    this._tokenHeader = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${JSON.parse(localStorage.getItem('token'))}`
    })
    console.log(`Sending request to ${this._baseUrl}`)
  }

  public async validateToken(): Promise<boolean>{
    return this._http.get<boolean>(this._baseUrl+"validate", {headers: this._tokenHeader}).toPromise();
  }

  public login(username: string, password: string):Observable<any>{
    return this._http.post(this._baseUrl+"signin", {
      username: username,
      password: password
    });
  }
}
