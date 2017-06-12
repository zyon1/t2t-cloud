import { Component, OnInit, Input } from '@angular/core';

import { UnitsService } from '../../units.service';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { UnitsWizzardService } from '../../units-wizzard.service';

@Component({
  selector: 'app-object-policies',
  templateUrl: './object-policies.component.html',
  styleUrls: ['./object-policies.component.css']
})
export class ObjectPoliciesComponent implements OnInit {
obj:any={};
oid:any;
gid:any;
uid:any;
unid:any;
ObjPolicies:any={  "chkInOut": [
    {
      "hour": "",
      "minute": ""
    },
    {
      "hour": "",
      "minute": ""
    },
   ],

     cancelation:{
       label:"Besplatna",
       values: []
     },
     smoking:false,
     rules:''
};
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
  constructor(
    private us: UnitsService,
    private uws:UnitsWizzardService,
    private route: ActivatedRoute, private router: Router
    ) { }

  ngOnInit() {
     this.route.parent.params.subscribe(params=>
    {
      //console.log(this.route.params);
      this.oid=params['oid'];
      this.gid=params['gid'];
      this.uid=params['id'];
      console.log(this.gid, this.uid, this.oid);
      this.us.getObjectPolicies(this.oid).subscribe(data=>{
        if (data.cancelation && typeof data.cancelation.values == undefined){
          data.cancelation.values=[];
        }
               // console.log('db data:',data,  typeof data.cancelation.values);

        Object.assign(this.ObjPolicies, data);
      });
      }
    );
  }
 onSubmit(data) {
     console.log(data);
     event.preventDefault();
     this.us.updateObjectPolicies(this.oid, data).then(r => {
     this.uws.setObjectState(this.oid, 'politika', 'slike').then(re=>{
                this.router.navigate(['auth/user/'+this.uid+'/group/'+this.gid+'/units/object/'+this.oid+'/pics']);         

     });

     });
   }
  }