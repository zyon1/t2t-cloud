import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router} from '@angular/router';
import { UnitsWizzardService} from '../../units-wizzard.service';
import { UnitsService} from '../../units.service';

@Component({
  selector: 'app-unit-kitchen',
  templateUrl: './unit-kitchen.component.html',
  styleUrls: ['./unit-kitchen.component.css']
})
export class UnitKitchenComponent implements OnInit {
  KBObject:any={
    noKitchen:false,
    stove:false,
    oven:false,
    refrigerator:false,
    microwave:false,
    kitchenware:false,
    electricKettle:false,
    espresso:false,
    dishwasher:false,
    noBathroom:0,
    noWc:0,
    showers:0,
    bathtubs:0,
    jacuzzy:0,
    sauna:false
    



  };
   unid:string;
oid:string;
newUrl:string;
  constructor(private route: ActivatedRoute, private router:Router, private uws:UnitsWizzardService, private us:UnitsService) { 
 this.route.params.subscribe( params => {
       console.log(params);
       this.uws.setUnid(params['unid']);
       this.unid=params['unid'];
       this.us.getUnitKB(params['unid']).subscribe(data=>{
        console.log('db data:',data);
        Object.assign(this.KBObject, data);
      });
      });
      this.oid=this.uws.oid;
  }

  ngOnInit() {
        this.router.events.subscribe(route => {
          let urlArray=route['url'].toString().split('/');
          urlArray[urlArray.length-1]='eq';
          this.newUrl=urlArray.join('/');
    });
  }
 onSubmit(data) {
    event.preventDefault();
     this.us.updateUnitKB(this.unid, data).then( _ => {
      this.uws.setUnitState(this.unid, 'kb', 'oprema').then( _ => {
this.router.navigate([this.newUrl]);
      });
     });
   }
}
