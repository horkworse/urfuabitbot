import {Directive, ElementRef, Input, OnInit} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';

@Directive({
  selector: '[inputValidation]'
})
export class InputValidationDirective implements OnInit {

  @Input('inputValidation')
  private _formGroup: FormGroup;
  private _componentName: string;
  private _component: FormControl;

  static ValidStyle: string = "is-valid";
  static InvalidStyle: string = "is-invalid";

  constructor(
    private _element: ElementRef
  ) {
  }


  ngOnInit(): void {
    let inputElement = this._element.nativeElement
    if(inputElement){
      this._componentName = inputElement.getAttribute('formControlName')
    }
    if(!this._componentName){
      console.log("InputValidationDirective: Unable to get the control name")

      return
    }

    let control = this._formGroup.get(this._componentName);
    if(!(control instanceof FormControl)){
      console.log("InputValidationDirective: Unable to get FormControl")

      return;
    }

    this._component = control as FormControl;

    this._component.valueChanges.subscribe((status) => {
      this.statusChange(status);
    })
  }

  private statusChange(status: string) {
    let classList = this._element.nativeElement.classList;

    if(!status){
      classList.remove(InputValidationDirective.ValidStyle)
      classList.remove(InputValidationDirective.InvalidStyle)

      return
    }

    if(this._component.valid){
      classList.remove(InputValidationDirective.InvalidStyle)
      classList.add(InputValidationDirective.ValidStyle)
    }
    else {
      classList.remove(InputValidationDirective.ValidStyle)
      classList.add(InputValidationDirective.InvalidStyle)
    }
  }
}
