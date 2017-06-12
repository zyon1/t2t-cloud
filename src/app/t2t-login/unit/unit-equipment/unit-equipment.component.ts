import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router} from '@angular/router';
import { UnitsWizzardService} from '../../units-wizzard.service';
import { UnitsService} from '../../units.service';

@Component({
  selector: 'app-unit-equipment',
  templateUrl: './unit-equipment.component.html',
  styleUrls: ['./unit-equipment.component.css']
})
export class UnitEquipmentComponent implements OnInit {
oid:string;
unid:string;
EqObject:any={
  dryer:false,
  washingmachine:false,
  iron:false,
  linen:false,
  towels:false,
  safe:false,
  cot:false,
  flatscreen:false,
  cable:false,
  satellite:false,
  local:false,
  radio:false,
  hifi:false,
  projector:false,
  professionalAudio:false
}
newUrl:string;
  constructor(private route: ActivatedRoute, private router:Router, private uws:UnitsWizzardService, private us:UnitsService) { 
    this.route.params.subscribe( params => {
       console.log(params);
       this.uws.setUnid(params['unid']);
       this.unid=params['unid'];
       this.us.getUnitEq(params['unid']).subscribe(data=>{
        console.log('db data:',data);
        Object.assign(this.EqObject, data);
      });
      });
      this.oid=this.uws.oid;
  }

  ngOnInit() {
        this.router.events.subscribe(route => {
          let urlArray=route['url'].toString().split('/');
          urlArray[urlArray.length-1]='rooms';
          this.newUrl=urlArray.join('/');
    });
  }
   onSubmit(data) {
 event.preventDefault();
     this.us.updateUnitEq(this.unid, data).then( _ => {
      this.uws.setUnitState(this.unid, 'oprema', 'sobe').then( _ => {
this.router.navigate([this.newUrl]);
      });
     });
   }

}
