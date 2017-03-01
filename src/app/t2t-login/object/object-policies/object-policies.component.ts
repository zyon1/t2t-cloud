import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-object-policies',
  templateUrl: './object-policies.component.html',
  styleUrls: ['./object-policies.component.css']
})
export class ObjectPoliciesComponent implements OnInit {
obj:any={};
chkInOutOpts ={
  fields:[
    {
      name: 'hour',
     label:'Sat:',
      type: 'number',
      rules: {
        min: "0",
        max: "23"
      }
    },
    {
        name:'minute',
      label:'Minuta',
      type: 'number',
      rules: {
        min: "0",
        max: "59"
      }
    }
  ],
 static:true
 
};
  constructor() { }

  ngOnInit() {
  }
onSubmit(){}
}