import {Inject, Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {IStudent} from '../../../../../server/models/student';
import {IGroupIndex, INewMentor} from '../../../components/admin-panel/children/mentor-control/new-user.interface';
import {tap} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private _tokenHeader;

  constructor(private _http: HttpClient, @Inject('BASE_URL') private _baseUrl: string) {
    if(localStorage.getItem("token")){
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
    return this._http.post<void>(this._baseUrl+"student/addStudentToGroup/", student, {headers: this._tokenHeader});
  }

  public isAdmin(): Observable<boolean> {
    return this._http.get<boolean>(this._baseUrl+"adminVerify", {headers: this._tokenHeader});
  }

  public getAllStudent(): Observable<IStudent[]>{
    return this._http.get<IStudent[]>(this._baseUrl+"student/getAll/", {headers: this._tokenHeader});
  }

  newUser(newMentor: INewMentor, indexGroup: IGroupIndex) {
    return this._http.post<number>(this._baseUrl+"createNewUser", [newMentor, indexGroup], {headers: this._tokenHeader});
  }

  getStudentsByGroup() {
    return this._http.get<IStudent[]>(this._baseUrl+'student/getByGroup', {headers: this._tokenHeader});
  }
}
