import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AuthService} from '../../../../service/auth/auth.service';
import {ApiService} from '../../../../service/data/api/api.service';
import {IGroupIndex, INewMentor} from './new-user.interface';
import {tap} from 'rxjs/operators';
import {Subscription} from 'rxjs';
import {Clipboard} from '@angular/cdk/clipboard';
import {Institute} from '../../../../../../server/models/Institute';

@Component({
  selector: 'app-mentor-control',
  templateUrl: './mentor-control.component.html',
  styleUrls: ['./mentor-control.component.css']
})
export class MentorControlComponent implements OnInit {
  public newMentorForm: FormGroup;
  public isFirstStage: boolean = true;
  public keyMessage: number;
  public institutes: any[] = [
    {
      name: 'ИРИТ-РтФ',
      index: Institute.rtf
    }, {
      name: 'ИНМиТ',
      index: Institute.inmt
    }
  ];

  constructor(
    private _formBuilder: FormBuilder,
    private _auth: AuthService,
    private _api: ApiService,
    private _clipboard: Clipboard) {
  }

  ngOnInit(): void {
    this.newMentorForm = this._formBuilder.group({
      firstName: [null, [Validators.required]],
      secondName: [null, [Validators.required]],
      institute: [null, [Validators.required]],
      vkLink: [null, [Validators.required]],
      group: [null, [Validators.required]]
    });
  }

  onSubmit() {
    if (this.isFirstStage) {
      let correctLink = this.newMentorForm.value.vkLink.split('/')
      let newMentor: INewMentor = {
        firstName: this.newMentorForm.value.firstName,
        institute: this.newMentorForm.value.institute,
        secondName: this.newMentorForm.value.secondName,
        vkLink: correctLink[correctLink.length-1]
      };
      let indexGroup: IGroupIndex = {
        groupIndex: this.newMentorForm.value.group

      };
      let subscription: Subscription = this._api.newUser(newMentor, indexGroup)
        .pipe(
          tap(x => console.log(x))
        )
        .subscribe(
          (next: number): void => {
            if (next) {
              console.log(next);
              this.isFirstStage = !this.isFirstStage;
              this.keyMessage = next;
              subscription.unsubscribe();
            }
          },
          error => console.error(error)
        );
    }
    if (!this.isFirstStage) {
      this.isFirstStage = !this.isFirstStage;
    }
  }

  copyKey() {
    this._clipboard.copy(this.keyMessage.toString());
  }
}
