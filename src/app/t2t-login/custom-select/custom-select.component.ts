import { Component, OnInit, Input, forwardRef, OnChanges } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, NG_VALIDATORS, FormControl } from '@angular/forms';


const noop = () => {
};

export function createSelectRangeValidator(length) {
  return function validateSelectRange(c: FormControl) {
    let err = {
      rangeError: {
        given: c.value,
        max: length,
        min: 0
      }
    };

    return (c.value > +length || c.value <= -1) ? err: null;
  }
}

@Component({
  selector: 'app-custom-select',
  templateUrl: './custom-select.component.html',
  styleUrls: ['./custom-select.component.css'],
  providers: [
    { 
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CustomSelectComponent),
      multi: true
    },
     { 
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => CustomSelectComponent),
      multi: true
    }
  ]
})
export class CustomSelectComponent implements OnInit, ControlValueAccessor {
/*
Stara verzija -> i dalje radi ["val1", "val2"]
Proširenje ->
Sada se može values zadati i u obliku: [{label:"Naziv1", value: "vrijednost1"},{label:"Naziv2", value: "vrijednost2"}]
s tim da je onda value komonente cijeli objekt sa labelom i value-om
 */
@Input('values') values:any[]=[];
@Input('text') text:string;
selected:number=-1;
touched:boolean=false;
disabled:boolean;

  constructor() { }
 validateFn:Function;
private onTouchedCallback: () => void = noop;
private onChangeCallback: (_: any) => void = noop;

  ngOnInit() {
    this.validateFn = createSelectRangeValidator(this.values.length);
  }
  ngOnChanges(changes) {
    if (changes.counterRangeMin || changes.counterRangeMax) {
      this.validateFn = createSelectRangeValidator(this.values.length);
    }
  }

  validate(c: FormControl) {
    return this.validateFn(c);
  }

   writeValue(value: any) {
      if (value !== undefined) {
        let i=0;
        this.values.forEach(element => {
          if (element==value){
            console.log(element, value, i);
            this.select(i);
          }
          i++;
        });
      }
  }

 
  propagateChange = (_: any) => {};

  registerOnChange(fn) {
    this.propagateChange = fn;
  }

  registerOnTouched(fn) {
    this.touched=true;
    this.onTouchedCallback = fn;
  }

  


setDisabledState(isDisabled: boolean){
  this.disabled=isDisabled;
}
/* get selectedValue() {
    return this.selected;
  }

  set selectedValue(val) {
    this.selected = val;
    this.propagateChange(this.selected);
  }
*/
   select(value: number){

    this.selected=value;
    if (value!=-1){
    this.propagateChange(this.values[value]);
  }
  else{
    this.propagateChange(value);
  }
    console.log(value);
  }

}
