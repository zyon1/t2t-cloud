
import { Component, OnInit, Input } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { GroupService } from '../group.service';
import { LoginService } from '../login.service';
import { UnitsService } from '../units.service';
import { CustomSelectComponent } from '../custom-select/custom-select.component';

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
others=[{name:'', value:''}];
parking:any=-1;
shortDesc:string='';
longDesc:string='';
ePair={name:'Naziv', value:'Vrijednost'};
expl="* Ukoliko se želi opisati pojavnost nekog svojstva, tada se vrijednost ostavlja prazna";
parkingTypes=['Javni besplanto', 'Javni naplata', 'Privatno prakirno mjesto', 'Privatna garaža'];


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
