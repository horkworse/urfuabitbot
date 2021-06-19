import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {IStudent} from '../../../../../../server/models/student';
import {ApiService} from '../../../../service/data/api/api.service';
import {Institute} from '../../../../../../server/models/Institute';
import {mongoose} from '@typegoose/typegoose';
import {Observable} from 'rxjs';

@Component({
  selector: 'app-student-search.web',
  templateUrl: './student-search.web.component.html',
  styleUrls: ['./student-search.web.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StudentSearchComponent implements OnInit {
  public studentStorage$: Observable<IStudent[]>;

  constructor(
    private _api: ApiService
  ) { }

  ngOnInit(): void {
    this.getStudents()
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

  private getStudents(){
    this.studentStorage$ = this._api.getAllStudent()
  }

  public resolveGroup(_id: mongoose.Types.ObjectId) {
    return
  }
}
