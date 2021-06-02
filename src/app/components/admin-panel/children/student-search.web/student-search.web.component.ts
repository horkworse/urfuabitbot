import { Component, OnInit } from '@angular/core';
import {MatDialogRef} from '@angular/material/dialog';
import {IStudent} from '../../../../../../server/models/student';
import {ApiService} from '../../../../service/data/api/api.service';
import {Institute} from '../../../../../../server/models/Institute';
import {mongoose} from '@typegoose/typegoose';

@Component({
  selector: 'app-student-search.web',
  templateUrl: './student-search.web.component.html',
  styleUrls: ['./student-search.web.component.css']
})
export class StudentSearchComponent implements OnInit {
  public studentStorage: IStudent[] = [];

  constructor(
    public dialogRef: MatDialogRef<StudentSearchComponent>,
    private _api: ApiService
  ) { }

  ngOnInit(): void {
    this._api.getAllStudent().subscribe(students => {
      this.studentStorage = students
    })
  }

  public resolveInstitute(inst: Institute): string{
    switch (inst) {
      case Institute.rtf:
        return "ИРИТ-РтФ";
      case Institute.inmt:
        return "ИНМиТ";
      default:
        return "Ошибка"
    }
  }

  public resolveGroup(_id: mongoose.Types.ObjectId) {

  }
}
