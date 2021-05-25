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

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    NavigationComponent,
    LoginComponent,
    AdminPanelComponent
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot([
      { path: "", component: HomeComponent},
      { path: "login", component: LoginComponent}
    ]),
    NgbModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  providers: [
    {provide: "BASE_URL", useFactory: getBaseUrl}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }



export function getBaseUrl(){
  return options.base_url;
}
