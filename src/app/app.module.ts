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

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    NavigationComponent,
    LoginComponent,
    AdminPanelComponent,
    StudentSearchComponent
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot([
      { path: "", component: HomeComponent},
      { path: "login", component: LoginComponent},
      { path: "admin", component: AdminPanelComponent}
    ]),
    NgbModule,
    ReactiveFormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatDialogModule
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
