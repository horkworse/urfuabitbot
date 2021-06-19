import {Component, Inject, Injector, OnInit} from '@angular/core';
import {MentorControlComponent} from './children/mentor-control/mentor-control.component';
import {TuiDialogService} from '@taiga-ui/core';
import {PolymorpheusComponent} from '@tinkoff/ng-polymorpheus';
import {StudentSearchComponent} from './children/student-search.web/student-search.web.component';

@Component({
  selector: 'app-admin-panel',
  templateUrl: './admin-panel.component.html',
  styleUrls: ['./admin-panel.component.less']
})
export class AdminPanelComponent implements OnInit {

  constructor(
    @Inject(TuiDialogService) private readonly _dialogService: TuiDialogService,
    private _injector: Injector
  ) {
  }


  ngOnInit(): void {

  }

  public newMentor() {
    this._dialogService.open(
      new PolymorpheusComponent(MentorControlComponent), {
        label: "Добавление наставника"
      }
    ).subscribe(
      () => {
      },
      error => console.error(error),
      () => {
        console.log('close');
      }
    );
  }

  public showAllStudent() {
    this._dialogService.open(
      new PolymorpheusComponent(StudentSearchComponent, this._injector), {
        label: "Список студентов",
        size: "page"
      }
    ).subscribe(
      () => {
      },
      error => console.error(error),
      () => {
        console.log('close');
      }
    );
  }
}
