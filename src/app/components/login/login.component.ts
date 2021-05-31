import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AuthService} from '../../service/auth/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
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

  constructor(private _formBuilder: FormBuilder, private _auth: AuthService) { }

  ngOnInit(): void {
    this.isLoginForm = true;
    this.currentTip = this._inviteActionArray[0];
    this.currentAction = this._actionArray[0]; //to Enum
    this.loginForm = this._formBuilder.group({
      login: [null, [Validators.required]],
      password: [null, [Validators.minLength(8), Validators.required]]
    })
    this.signupForm = this._formBuilder.group({
      inviteKey: [null, [Validators.required]],
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
      console.log(this.loginForm.controls)
      this._auth.authenticate(this.loginForm.value.login, this.loginForm.value.password)
    }
    if(!this.isLoginForm && this.signupForm.valid){
      this._auth.register(this.signupForm.value.login, this.signupForm.value.password, this.signupForm.value.inviteKey)
    }
  }

  isAuthorized() {
    return this._isAuthorized
  }

  logout() {
    this._auth.logout();
  }
}
