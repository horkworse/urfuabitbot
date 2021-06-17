import {Injectable} from '@angular/core';
import {TuiNotification, TuiNotificationsService} from '@taiga-ui/core';

@Injectable({
  providedIn: 'root'
})
export class SatelliteNotificationService {

  constructor(
    private _notifyService: TuiNotificationsService
  ) {
  }

  public sendAuthWarning(reason: string) {
    this._notifyService.show(reason, {
      label: 'Авторизация',
      autoClose: 2500,
      status: TuiNotification.Warning
    }).subscribe();
  }

  public sendNotImplemented() {
    this._notifyService
      .show('Dale обьебался и забыл реализовать фичу!',
        {
          label: 'Господи, боже мой (+_+)',
          status: TuiNotification.Error,
          autoClose: false
        }).subscribe();
  }

  public sendNotValidForm() {
    this._notifyService.show('Пожалуйста, проверьте корректность введенных данных',
      {
        label: 'Ошибка формы',
        autoClose: 3000,
        status: TuiNotification.Warning
      }
    ).subscribe();
  }
}
