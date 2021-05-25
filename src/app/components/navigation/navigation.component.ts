import { Component, OnInit } from '@angular/core';
import {AuthService} from '../../service/auth/auth.service';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css']
})
export class NavigationComponent implements OnInit {

  public name: string = "Login";

  constructor(private _auth: AuthService) {
  }

  ngOnInit(): void {
    this._auth.isAuth.subscribe(result => {
      if(result) {
        this.name = JSON.parse(localStorage.getItem('token')).fullname;
      }
      else {
        localStorage.removeItem('token')
      }
    })
    this._auth.isAuthenticated()
    this._auth.nameSubject.subscribe(value => this.name = value);
  }

}
