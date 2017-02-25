
import { Component, OnInit, Input, forwardRef, OnChanges,  
  trigger,
  state,
  style,
  transition,
  animate } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, NG_VALIDATORS, FormControl } from '@angular/forms';
import 'rxjs/Rx';
import { Observable, Subject } from 'rxjs/Rx';
const noop = () => {
  //console.log('asdf');
};
export function createValidator() {
  return function validate(c: FormControl) {
     return null;
  
}
}
@Component({
  selector: 'app-cancelation-policies',
  templateUrl: './cancelation-policies.component.html',
  styleUrls: ['./cancelation-policies.component.css'],
   animations: [
  trigger('flyInOut', [
    state('in', style({})),
     state('out', style({width:'0%'})),
    transition('void => *', [
      style({width: '0%'}),
      animate(500)
    ]),
    transition('* => void', [
   
      animate(500, style({width: '0%'}))
    ])
  ])
],
  providers: [
    { 
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CancelationPoliciesComponent),
      multi: true
    },
     { 
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => CancelationPoliciesComponent),
      multi: true
    }]
})
export class CancelationPoliciesComponent implements OnInit, ControlValueAccessor {
  stateExpression: string='in';
disabled:boolean;
//periodLength:number=400;
policy:any=-1;
policies:any[]=[
  {name:"Besplatna", values: []}, 
  {name: "Fleksibilna", values:[{percent:100, pLength: 7}]}, 
  {name: "Umjerena1", values:[{percent: 30, pLength: 30},{percent:100, pLength: 7}]}, 
   {name: "Umjerena2", values:[{percent: 30, pLength: 60},{percent:100, pLength: 7}]}, 
  {name: "Stroga", values:[{percent:50, pLength: 30}, {percent: 100, pLength:30}]}, 
  {name: "Vrlo stroga", values:[{percent:70, pLength: 30}, {percent: 100, pLength:30}]}, 
  {name: "Po mjeri", values:[]} ];

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
 
};
/*
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
      },
    checkbox: {
    all: false,
    first: true,
    label: 'Početak perioda od trenutka rezervacije.'
  }
    }
  },
  explainer: "",
  addDesc: "period",
 
};*/
animationDelay$= Observable.of(null);
animationState$=new Subject();
valRules:any={pLength:{minVal: 7}};
emptyPolicy={percent:'Postotak', pLength:'Duljina perioda'};
expl:string="";
testPolicies:any[]=[{percent:30, pLength: 30}, {percent:50, pLength:30}, {percent: 75, pLength:15}, {percent:100, pLength: 15}];
timelineArray:any[]=this.testPolicies;
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
        //setTimeout(x=>{this.flyOut(); setTimeout(x=>{this.flyIn()}, 1000);}, 3000);

  }
  flyIn(){
    this.stateExpression='in';
  }
  flyOut(){
    this.stateExpression='out';
  }
  ngOnChanges(changes) {
   // this.validateFn = createValidator();
  
  }

  validate(c: FormControl) {
    //return this.validateFn(c);
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
updateFn(event){
  console.log(event);
  /*
this.animationState$.subscribe(state=>{
  console.log('state',state);
  if(state=='done'){*/
    this.total=0;

this.tpLength=this.testPolicies.length;
//console.log(this.tpLength);
        this.testPolicies.forEach(element => {
     if(element.pLength) {this.total+=+element.pLength;}
      //console.log(element);
    });
    console.log('total',this.total);
    //this.write(this.testPolicies);
    /*
  }
});
*/

}
animationStarted(event){
  
  //console.log('start',event);
}
animationDone(event){
  console.log('end',event);
this.animationState$.next('done');


}
}