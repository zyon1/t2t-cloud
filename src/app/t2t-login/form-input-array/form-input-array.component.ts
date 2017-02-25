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
  
  @Input('items')items:any[];
  @Input('options')options:any; 
 chkStyle = {
    // CSS styles: set per current state of component properties
    'position':  'absolute',
    'bottom': '-26px',
    'left':'0'
  };
  chkParentStyle = {
    'position':'relative',
    'margin-bottom': '-27px'
  }
/*
primjer za object-policies
FIAOptions ={
  fields:[
    {
      name: 'percent',
     label:'Postotak',
      type: 'number',
      default: "0",
      rules: {
        min: "0",
        max: "100"
      }
    },
    {
        name:'pLength',
      label:'Duljina perioda',
      type: 'number',
      default: 7,
      rules: {
        min: "7",
        max: "120"
      }
    },
       {
      name:'startR',
      label:'Početak perioda od trenutka rezervacije.',
      type: 'checkbox',
      default: false,

      firstOnly: true,
    }
  ],
  explainer: "",
  addDesc: "period",
  static: false // ako je static true onda omogućava dodavanje i brisanje polja
 
};

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
  if (this.items){this.write(this.items);}
  console.log(this.options);
  
   // this.keys=Object.keys(this.emptyPair);
    //ovo je u redu this.keysNew=Object.keys(this.options.pair);
    //console.log(this.keysNew);
//console.log(this.keys, this.emptyPair, this.pairs);
    //this.emptyVal={[this.keys[0]]:'', [this.keys[1]]:''};
    //ovo je u redu this.emptyValNew={[this.keysNew[0]]:this.options.pair[this.keysNew[0]].default, [this.keysNew[1]]:this.options.pair[this.keysNew[1]].default};
    //console.log(this.emptyValNew);
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

  addItem(){
    let emptyItem={};
let defaultFlag=false;

      this.options.fields.forEach(element => {
        if (element.default) {
          emptyItem[element.name]=element.default;
          defaultFlag=true;
        }
  
    });

    this.items.push(emptyItem);
    if (defaultFlag){this.write(this.items);}
    console.log(emptyItem);
  }


setDisabledState(isDisabled: boolean){
  this.disabled=isDisabled;
}

   write(value){
     //console.log(value);
     if (value) {this.items=value;}
     //if(value && !this.loaded){this.location=value;this.loaded=true;}
    this.propagateChange(value);
  }
  capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

}
