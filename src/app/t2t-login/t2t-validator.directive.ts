import { Directive } from '@angular/core';

import {
  FormControl,
  Validators,
  AbstractControl,
  NG_VALIDATORS
} from '@angular/forms';

function validator(control: FormControl): {[key:string]: boolean} {
  console.log(control.value);
  if ( control.value!='asdf' /*|| !control.value.match(/^pee/)*/) {
    return { 'badName': true };
  }
}
@Directive({
  selector: '[t2t-validator]',
  providers: [
    { provide: NG_VALIDATORS, useValue: validator, multi: true }
  ]
})
export class T2tValidatorDirective {

  
}
