import { Injectable } from '@angular/core';
import {ApiService} from '../data/api/api.service';
import {Subject, Subscription} from 'rxjs';
import {Router} from '@angular/router';
import {resolve} from '@angular/compiler-cli/src/ngtsc/file_system';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  public nameSubject: Subject<string>;
  public isAuth: Subject<boolean>;
  public validationSub: Subscription;

  constructor(private _api: ApiService, private _router: Router) {
    this.nameSubject = new Subject<string>();
    this.isAuth = new Subject<boolean>()
  }

  public isAuthenticated():void{
    if(localStorage.getItem('token')){
      this.validationSub = this._api.validateToken().subscribe(result => {
        this.isAuth.next(result)
      },err => {},() => {
        console.log("Validate executed")
        this.validationSub.unsubscribe()})
    }
  }

  public logout(){
    localStorage.removeItem('token')
    this._router.navigate(['/'])
    this.nameSubject.next('Login')
    this.isAuth.next(false)
  }

  public authenticate(login: string, password: string){
    this._api.login(login, password).subscribe(value => {
      console.log(value)
      this.nameSubject.next(value.fullname);
      localStorage.setItem("token", JSON.stringify(value))
      this._api.setupHeaders()
      this._router.navigate([""])
    })
  }

  public register(login: string, password: string, inviteKey: string){
    this._api.signup(login, password,inviteKey).subscribe(res => {
      console.log(res)
      this._router.navigate(['login'])
    })

  }
}
