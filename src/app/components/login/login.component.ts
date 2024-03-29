import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AuthService} from '../../service/auth/auth.service';
import {SatelliteNotificationService} from '../../service/notifier/satellite-notification.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.less']
})
export class LoginComponent implements OnInit {

  public loginForm: FormGroup
  public signupForm: FormGroup
  public isLoginForm: boolean;
  public currentAction: string;
  private _actionArray: Array<string> = ["Войти","Зарегистрироваться"]
  private _inviteActionArray: Array<string> = ["Вас нет в системе?", "Уже зарегистрированы?"]
  public currentTip: string;
  private _isAuthorized: boolean;
  private _authSubcription;

  constructor(
    private _formBuilder: FormBuilder,
    private _auth: AuthService,
    private _notifyService: SatelliteNotificationService) { }

  ngOnInit(): void {
    this.isLoginForm = true;
    this.currentTip = this._inviteActionArray[0];
    this.currentAction = this._actionArray[0]; //to Enum
    this.loginForm = this._formBuilder.group({
      login: [null, [Validators.required]],
      password: [null, [Validators.minLength(8), Validators.required]]
    })
    this.signupForm = this._formBuilder.group({
      inviteKey: [null, [Validators.required, Validators.minLength(14)]],
      login: [null, [Validators.required]],
      password: [null, [Validators.minLength(8), Validators.required]]
    })
    this._authSubcription = this._auth.isAuth.subscribe(result => {
      this._isAuthorized = result
    })
    this._auth.isAuthenticated();
  }

  public switchForm(): void{
    this.isLoginForm = !this.isLoginForm
    this.currentAction = this.isLoginForm? this._actionArray[0] : this._actionArray[1];
    this.currentTip = this.isLoginForm? this._inviteActionArray[0] : this._inviteActionArray[1];
  }

  public login():void{

  }

  onSubmit() {
    if(this.isLoginForm && this.loginForm.valid){
      this._auth.authenticate(this.loginForm.value.login, this.loginForm.value.password)

      return
    }
    if(!this.isLoginForm && this.signupForm.valid){
      this._auth.register(this.signupForm.value.login, this.signupForm.value.password, this.signupForm.value.inviteKey)

      return
    }
    this._notifyService.sendAuthWarning("Заполните все необходимые поля")
  }

  isAuthorized() {
    return this._isAuthorized
  }

  logout() {
    this._auth.logout();
  }
}
