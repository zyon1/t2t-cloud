import { Component, OnInit, Input, forwardRef, OnChanges } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, NG_VALIDATORS, FormControl } from '@angular/forms';
const noop = () => {
  //console.log('asdf');
};
export function createValidator() {
  return function validate(c: FormControl) {
     return null;
  
}
}
@Component({
  selector: 'app-form-input-array',
  templateUrl: './form-input-array.component.html',
  styleUrls: ['./form-input-array.component.css'],
  providers: [
    { 
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FormInputArrayComponent),
      multi: true
    },
     { 
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => FormInputArrayComponent),
      multi: true
    }]
})
export class FormInputArrayComponent implements OnInit, ControlValueAccessor {
  @Input('pairs')pairs:any[];
  @Input('emptyPair')emptyPair:any; // u options
  @Input('valRules')valRules:any; // u options
  @Input('explainer')explainer:string; // u options
  @Input('addDesc')addDesc:string="svojstvo"; // u options
  @Input('options')options:any; 
/*
primjer za object-policies
FIAOptions ={
  pair{
    percent:{
      name:'Postotak',
      type: 'number',
      default: 0,
      rules: {
        min: 0,
        max: 100
      }
    },
    pLength:{
      name:'Duljina perioda',
      type: 'number',
      default: 7,
      rules: {
        min: 7,
        max: 120
      }
  },
  explainer: ""
  addDesc: "period"
  checkbox: {
    all: false,
    first: true,
    label: 'Postavi prvi period od dolaska gosta'
  }


}

 */
  keys:any[]=['val1', 'val2'];

  emptyVal:any;
  disabled:boolean;
  private onTouchedCallback: () => void = noop;
  private onChangeCallback: (_: any) => void = noop;
  validateFn:Function;

  keysNew:any;
  emptyValNew:any;
  constructor() { 
    
    
  }
  ngOnInit() {
  if (this.pairs){this.write(this.pairs);}
  console.log(this.options);
  
    this.keys=Object.keys(this.emptyPair);
    //ovo je u redu this.keysNew=Object.keys(this.options.pair);
    console.log(this.keysNew);
//console.log(this.keys, this.emptyPair, this.pairs);
    this.emptyVal={[this.keys[0]]:'', [this.keys[1]]:''};
    //ovo je u redu this.emptyValNew={[this.keysNew[0]]:this.options.pair[this.keysNew[0]].default, [this.keysNew[1]]:this.options.pair[this.keysNew[1]].default};
    console.log(this.emptyValNew);
//console.log(this.emptyVal);
  }
  ngOnChanges(changes) {
    this.validateFn = createValidator();
    //console.log(changes);
  
  }

  validate(c: FormControl) {
    return this.validateFn(c);
  }

  writeValue(value: any) {
    if (value !== undefined) {
    this.write(value);
      }
  }

 
  propagateChange = (_: any) => {};

  registerOnChange(fn) {
    this.propagateChange = fn;
  }

  registerOnTouched(fn) {
    this.onTouchedCallback = fn;
  }

  addPair(){
    this.emptyVal={[this.keys[0]]:'', [this.keys[1]]:''};

    this.pairs.push(this.emptyVal);
    console.log(this.emptyVal);
  }


setDisabledState(isDisabled: boolean){
  this.disabled=isDisabled;
}

   write(value){
     //console.log(value);
     if (value) {this.pairs=value;}
     //if(value && !this.loaded){this.location=value;this.loaded=true;}
    this.propagateChange(value);
  }
  capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

}
