
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
 oid:string;
  uid:string;
  gid:string;
  unid:string;
  constructor(private route: ActivatedRoute, private router: Router,
    private groupService: GroupService,
    private loginService: LoginService,
    private us: UnitsService
  ) { }

  ngOnInit() {

     this.route.parent.params.subscribe(params=>
    {
      //console.log(this.route.params);
      this.oid=params['oid'];
      this.gid=params['gid'];
      this.uid=params['id'];
      console.log(this.gid, this.uid, this.oid);
      }
    );

  }

}
