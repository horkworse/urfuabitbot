import { Component, OnInit } from '@angular/core';
import {ApiService} from '../../service/data/api/api.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {IStudent} from '../../../../server/models/student';

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
      firstname: [null, [Validators.required]],
      secondname: [null, [Validators.required]],
      vkLink: [null, [Validators.required]]
    })
  }

  public onSubmit() {
    if(!this.studentForm.valid){
      console.log("Error")

      return
    }
    this._api.sendStudent(<IStudent>{
      firstName: this.studentForm.value.firstname,
      secondName: this.studentForm.value.secondname,
      vkLink: this.studentForm.value.vkLink
    })
    this.studentForm.reset();
  }
}
