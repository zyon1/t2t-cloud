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
  selector: 'app-object-policies',
  templateUrl: './object-policies.component.html',
  styleUrls: ['./object-policies.component.css'],
  providers: [
    { 
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ObjectPoliciesComponent),
      multi: true
    },
     { 
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => ObjectPoliciesComponent),
      multi: true
    }]
})
export class ObjectPoliciesComponent implements OnInit, ControlValueAccessor {
disabled:boolean;
//periodLength:number=400;
policies:any[]=[];
FIAOptions ={
  pair:{
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
    }
  },
  explainer: "",
  addDesc: "period",
  checkbox: {
    all: false,
    first: true,
    label: 'Početak perioda od trenutka rezervacije.'
  }
};

valRules:any={pLength:{minVal: 7}};
emptyPolicy={percent:'Postotak', pLength:'Duljina perioda'};
expl:string="";
testPolicies:any[]=[{percent:30, pLength: 30}, {percent:50, pLength:30}, {percent: 75, pLength:15}, {percent:100, pLength: 15}];
total:number=0;
tpLength:number=this.testPolicies.length;
 private onTouchedCallback: () => void = noop;
  private onChangeCallback: (_: any) => void = noop;
  validateFn:Function;
  constructor() { 

    this.testPolicies.forEach(element => {
      this.total+=element.pLength;
    });
    console.log(this.policies);
    
  }
  ngOnInit() {

  }
  ngOnChanges(changes) {
    this.validateFn = createValidator();
  
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



setDisabledState(isDisabled: boolean){
  this.disabled=isDisabled;
}

   write(value){
     console.log(value);
     if (value) {
       this.policies=value;
       
    console.log(this.total, this.tpLength);

      }
     //if(value && !this.loaded){this.location=value;this.loaded=true;}
    this.propagateChange(value);
 
  }
  accValue(index){
    let accVal=0;
    let tempArr=this.testPolicies;
    //console.log(tempArr);
    for(let i=index; i<this.tpLength;i++){
      accVal+=+tempArr[i].pLength;
    }
    return accVal;
  }
  round(x){
    return Math.floor(x);
  }
updateFn(){
  this.total=0;
this.tpLength=this.testPolicies.length;
console.log(this.tpLength);
        this.testPolicies.forEach(element => {
      this.total+=+element.pLength;
      console.log(element);
    });
    console.log(this.total);
}
}
