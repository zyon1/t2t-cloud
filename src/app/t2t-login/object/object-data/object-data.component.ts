
import { Component, OnInit, Input } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { GroupService } from '../../group.service';
import { LoginService } from '../../login.service';
import { UnitsService } from '../../units.service';
import { CustomSelectComponent } from '../../custom-select/custom-select.component';

interface ObjData{
        oid: {
            parking?: number, // 1: public free, 2. public paid, 3. parking place, 4. garage
            wifi?: boolean,
            pets?: boolean,
            playground?: boolean, //kids playground
            pool?: boolean,
            grill?: boolean,
            peka?: boolean,
            other?: any,
            shortDesc?: string,
            lognDesc?: string
        }

}
@Component({
  selector: 'app-object-data',
  templateUrl: './object-data.component.html',
  styleUrls: ['./object-data.component.css']
})
export class ObjectDataComponent implements OnInit {
others=[{name:'sda', value:'sadsad'}];
parking:any=-1;
shortDesc:string='';
longDesc:string='';
ePair={name:'Naziv', value:'Vrijednost'};
expl="* Ukoliko se želi opisati pojavnost nekog svojstva, tada se vrijednost ostavlja prazna";
parkingTypes=['Javni besplanto', 'Javni naplata', 'Privatno prakirno mjesto', 'Privatna garaža'];
FIAOptions ={
  fields:[
    {
      name: 'name',
     label:'Naziv',
      type: 'text',
      default: '',

    },
    {
        name:'value',
      label:'Vrijednost',
      type: 'text',
      default: '',

    }
  ],
  explainer: "",
  addDesc: "period",
 
};
/*FIAOptions ={
  pair:{
    name:{
      name:'Naziv',
      type: 'text',
      default: '',
      rules: {
        maxLength: 30
      }
    },
    value:{
      name:'Vrijednost',
      type: 'text',
      default: '',
      rules: {
        maxLength: 30
      }
    }
  },
  explainer: "* Ukoliko se želi opisati pojavnost nekog svojstva, tada se vrijednost ostavlja prazna",
  addDesc: "period"
};*/

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private groupService: GroupService,
    private loginService: LoginService,
    private us: UnitsService
  ) { }

  ngOnInit() {
  }

}
