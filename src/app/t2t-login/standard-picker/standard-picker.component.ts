import { Component, OnInit, Input, forwardRef, OnChanges } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, NG_VALIDATORS, FormControl } from '@angular/forms';
@Component({
  selector: 'app-standard-picker',
  templateUrl: './standard-picker.component.html',
  styleUrls: ['./standard-picker.component.css'],
  providers: [
    { 
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => StandardPickerComponent),
      multi: true
    }]
})
export class StandardPickerComponent implements OnInit, ControlValueAccessor {
  @Input ('resetEnabled') reset=false;
stars:number=0;
selectedStars:number=0;
disabled:boolean;
  constructor() { }

  ngOnInit() {
  }



  writeValue(value: any) {
      if (value !== undefined) {
    this.selectedStars = value;
    this.stars= value;
      }
  }

 
  propagateChange = (_: any) => {};

  registerOnChange(fn) {
    this.propagateChange = fn;
  }

  registerOnTouched(fn) {
  }

  


setDisabledState(isDisabled: boolean){
  this.disabled=isDisabled;
}
select(value){
  this.selectedStars=value;
  this.stars=value;
    this.propagateChange(value);
}

}
