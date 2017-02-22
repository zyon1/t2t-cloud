
import { Component, Input, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-custom-form-control',
  templateUrl: './custom-form-control.component.html',
  styleUrls: ['./custom-form-control.component.css'],
  providers: [
    { 
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CustomFormControlComponent),
      multi: true
    }
  ]
})
export class CustomFormControlComponent implements ControlValueAccessor {
touched:boolean=false;
val:any;

@Input() inputVal = 0;
 _someValue = 0; // notice the '_'

  constructor() { }
    writeValue(value: any) {
      if (value !== undefined) {
    this.val = value;
  }
}
 propagateChange = (_: any) => {};

 get someValue() {
    return this._someValue;
  }
  set someValue(val){
    this._someValue = val;
    this.propagateChange(this._someValue);

  }


  registerOnChange(fn) {
    this.propagateChange = fn;
  }

  registerOnTouched() {
    this.touched=true;
  }

  customFn(){
    let someVal:any;
    /*
    do something
     */

    this.propagateChange=someVal;
  }

 
}
