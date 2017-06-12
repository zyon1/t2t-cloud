import { Component, OnInit } from '@angular/core';
import { CustomSelectComponent } from '../../custom-select/custom-select.component';
import { ActivatedRoute, Router} from '@angular/router';
import { UnitsWizzardService} from '../../units-wizzard.service';
import { UnitsService} from '../../units.service';


@Component({
  selector: 'app-unit-basic',
  templateUrl: './unit-basic.component.html',
  styleUrls: ['./unit-basic.component.css']
})
export class UnitBasicComponent implements OnInit {
 unitTypes:any=['Soba', 'Studio apartman', 'Apartman'];
 oid;
 unid:string;
 unitBasic:any={
   name:'',
   type:-1,
   floorNo:0,
   size:0,
   otherViewName:'',
   acPrice:0,
   separateEntrance:false,
   disabledAccess:false,
   sea:false,
   panorama:false,
   nature:false,
   garden:false,
   localView:false,
   otherView:false,
   elevator:false,
   shortDesc:'',
   central:false,
   floorHeating:false,
   wood:false,
   electricHeater:false,
   ac:false,
   ventilation:false,
   

 };
 myUrl:string;
  constructor(private route: ActivatedRoute, private router:Router, private uws:UnitsWizzardService, private us:UnitsService) { 
        this.route.params.subscribe( params => {
       console.log(params);
       this.uws.setUnid(params['unid']);
       this.unid=params['unid'];
       this.us.getUnitBasic(params['unid']).subscribe(data=>{
        console.log('db data:',data);
        Object.assign(this.unitBasic, data);
      });
      });
      this.oid=this.uws.oid;
  }
  
  ngOnInit() {
    this.router.events.subscribe(route => {
      this.myUrl=route['url'].toString();
    });
  }
  onSubmit(data) {
    event.preventDefault();
     console.log(data);
     this.us.updateUnitBasic(this.unid, data).then( _ => {
      this.uws.setUnitState(this.unid, 'osnovno', 'kb').then( _ => {
this.router.navigate([this.myUrl+'/kb']);
      });
     });
     
   }
}
