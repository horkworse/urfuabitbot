import { Component, OnInit } from '@angular/core';
import {ApiService} from '../../service/data/api/api.service';
import {FormBuilder, FormGroup} from '@angular/forms';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  public studentForm: FormGroup

  constructor(private _api: ApiService, private _formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.studentForm = this._formBuilder.group({
      firstname: [null, []],
      secondname: [null, []],
      vkLink: [null, []],
    })
  }

  public onSubmit() {

  }
}
