import { Injectable } from '@angular/core';
import {CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router, CanLoad, Route, UrlSegment} from '@angular/router';
import {Observable, Subscription} from 'rxjs';
import {AuthService} from '../service/auth/auth.service';
import {first, take, takeUntil} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardGuard implements CanActivate {
  private _authSubjectSubscription: Subscription;

  constructor(private _auth: AuthService, private router: Router) {

  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    this._auth.isAuthenticated()
    this._auth.isAuth.subscribe(x => {
      if(!x){
        this.router.navigate(['login'])
      }
    })
    return this._auth.isAuth;
  }

}
