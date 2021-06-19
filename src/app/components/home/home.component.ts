import {Component, OnInit} from '@angular/core';
import {ApiService} from '../../service/data/api/api.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {IStudent} from '../../../../server/models/student';
import {Subscription} from 'rxjs';
import {SatelliteNotificationService} from '../../service/notifier/satellite-notification.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.less']
})
export class HomeComponent implements OnInit {
  public studentForm: FormGroup;
  public studentStorage: IStudent[] = [];

  constructor(
    private _notifyService: SatelliteNotificationService,
    private _api: ApiService,
    private _formBuilder: FormBuilder
  ) {
  }

  ngOnInit(): void {
    this.studentForm = this._formBuilder.group({
      firstname: [null, [Validators.required, Validators.minLength(3)]],
      secondname: [null, [Validators.required, Validators.minLength(3)]],
      vkLink: [null, [Validators.required, Validators.minLength(8)]]
    });
    this.getGroupStudents();
  }

  public onSubmit() {
    if (!this.studentForm.valid) {
      this._notifyService.sendNotValidForm()

      return;
    }
    let correctLink = this.studentForm.value.vkLink.split('/');
    let student: IStudent = {
      firstName: this.studentForm.value.firstname,
      secondName: this.studentForm.value.secondname,
      vkLink: correctLink[correctLink.length - 1]
    };
    let subs = this._api.sendStudent(<IStudent> student).subscribe(
      next => {
      },
      error => {
      },
      () => {
        student['fullname'] = `${student.secondName} ${student.firstName}`;
        this.studentStorage.push(student);
        subs.unsubscribe();
      });
    this.studentForm.reset();
  }

  private getGroupStudents(): void {
    let groupSub: Subscription = this._api.getStudentsByGroup().subscribe(res => {
        this.studentStorage = res;
      },
      error => console.error(),
      () => {
        console.log('Sub delete');
        groupSub.unsubscribe();
      });
  }

  public changeUser(_id: string) {
    this._notifyService.sendNotImplemented();
  }
}
