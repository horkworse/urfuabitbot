import { Injectable } from '@angular/core';
import {ApiService} from '../data/api/api.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private _api: ApiService) { }

  public isAuthenticated():boolean{
    if(localStorage.getItem('token')){
      this.isTokenValid().then(r=>{
        if(r)

          return true
      })
    }

    return false
  }

  private async isTokenValid() {
    if (await this._api.validateToken())

      return true

    return false;
  }

  public authenticate(login: string, password: string){
    this._api.login(login, password).subscribe(value => {
      console.log(value)
    })
  }
}
