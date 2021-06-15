import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import * as options from './options.json'

import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { NavigationComponent } from './components/navigation/navigation.component';
import {RouterModule} from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { LoginComponent } from './components/login/login.component';
import {ReactiveFormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import { AdminPanelComponent } from './components/admin-panel/admin-panel.component';
import { StudentSearchComponent } from './components/admin-panel/children/student-search.web/student-search.web.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MAT_DIALOG_DEFAULT_OPTIONS, MatDialogModule} from '@angular/material/dialog';
import { MentorControlComponent } from './components/admin-panel/children/mentor-control/mentor-control.component';
import {AuthGuardGuard} from './guard/auth-guard.guard';
import {AdminGuardGuard} from './guard/admin-guard.guard';
import { InputValidationDirective } from './directive/input-validation.directive';
import {TuiButtonModule, TuiHintControllerModule, TuiRootModule, TuiTextfieldControllerModule} from '@taiga-ui/core';
import {TuiInputModule, TuiInputPasswordModule} from '@taiga-ui/kit';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    NavigationComponent,
    LoginComponent,
    AdminPanelComponent,
    StudentSearchComponent,
    MentorControlComponent,
    InputValidationDirective
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot([
      {path: '', component: HomeComponent, canActivate: [AuthGuardGuard],},
      {path: 'login', component: LoginComponent},
      {path: 'admin', component: AdminPanelComponent, canActivate: [AdminGuardGuard]}
    ]),
    NgbModule,
    ReactiveFormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatDialogModule,
    TuiRootModule,
    TuiButtonModule,
    TuiInputModule,
    TuiTextfieldControllerModule,
    TuiHintControllerModule,
    TuiInputPasswordModule
  ],
  entryComponents: [
    StudentSearchComponent
  ]
  ,
  providers: [
    {provide: "BASE_URL", useFactory: getBaseUrl},
    {provide: MAT_DIALOG_DEFAULT_OPTIONS, useValue: {hasBackdrop: false}}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }



export function getBaseUrl(){
  return options.base_url;
}
