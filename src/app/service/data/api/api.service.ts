import {Inject, Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {IStudent} from '../../../../../server/models/student';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private _tokenHeader;

  constructor(private _http: HttpClient, @Inject('BASE_URL') private _baseUrl: string) {
    if(localStorage.getItem("token")){
      debugger
      this.setupHeaders();
    }
    console.log(`Sending request to ${this._baseUrl}`)
  }

  public setupHeaders(){
    this._tokenHeader = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${JSON.parse(localStorage.getItem('token')).token}`
    })
  }

  public validateToken(): Observable<boolean>{
    return this._http.get<boolean>(this._baseUrl+"validate", {headers: this._tokenHeader});
  }

  public login(username: string, password: string):Observable<any>{
    return this._http.post(this._baseUrl+"signin", {
      username: username,
      password: password
    });
  }

  public signup(username: string, password: string, inviteKey: string):Observable<any>{
    return this._http.post(this._baseUrl+"signup/"+inviteKey, {
      username: username,
      password: password
    })
  }

  public sendStudent(student: IStudent): Observable<any> {
    console.log("Sending")
    return this._http.post(this._baseUrl+"student/addStudentToGroup", student, {headers: this._tokenHeader});
  }
}
