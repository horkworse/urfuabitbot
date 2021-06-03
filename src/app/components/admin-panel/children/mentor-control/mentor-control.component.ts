import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {AuthService} from "../../../../service/auth/auth.service";

@Component({
  selector: 'app-mentor-control',
  templateUrl: './mentor-control.component.html',
  styleUrls: ['./mentor-control.component.css']
})
export class MentorControlComponent implements OnInit {
  public  newMentorForm: FormGroup
  public isFirstStage: boolean = true;

  constructor(private _formBuilder: FormBuilder, private _auth: AuthService) { }

  ngOnInit(): void {
    this.newMentorForm = this._formBuilder.group({
      firstName: [null, [Validators.required]],
      secondName: [null, [Validators.required]],
      institute: [null, [Validators.required]],
      vkLink: [null, [Validators.required]],
      group: [null, [Validators.required]]
    })
  }

  onSubmit() {
    this.isFirstStage = !this.isFirstStage
  }
}
