import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AuthService} from '../../../../service/auth/auth.service';
import {ApiService} from '../../../../service/data/api/api.service';
import {IGroupIndex, INewMentor} from './new-user.interface';
import {tap} from 'rxjs/operators';
import {Observable, of, Subscription} from 'rxjs';
import {Clipboard} from '@angular/cdk/clipboard';
import {Institute} from '../../../../../../server/models/Institute';
import {TuiContextWithImplicit, tuiPure} from '@taiga-ui/cdk';

interface Inst {
  name: string,
  index: Institute
}

@Component({
  selector: 'app-mentor-control',
  templateUrl: './mentor-control.component.html',
  styleUrls: ['./mentor-control.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MentorControlComponent implements OnInit {
  public newMentorForm: FormGroup;
  public isFirstStage: boolean = true;
  public keyMessage: number;
  public institutes: Inst[] = [
    {
      name: 'ИРИТ-РтФ',
      index: Institute.rtf
    }, {
      name: 'ИНМиТ',
      index: Institute.inmt
    }
  ];
  public institutes$: Observable<any>

  constructor(
    private _formBuilder: FormBuilder,
    private _auth: AuthService,
    private _api: ApiService,
    private _clipboard: Clipboard,
    ) {
    this.institutes$ = of(this.institutes)
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

  @tuiPure
  public stringify(items: Inst[]){
    const map = new Map(items.map(({index, name}) => [index, name] as [number, string]));

    return ({$implicit}: TuiContextWithImplicit<number>) => map.get($implicit) || ''
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
