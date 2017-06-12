import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router} from '@angular/router';
import { UnitsWizzardService} from '../../units-wizzard.service';
import { UnitsService} from '../../units.service';


@Component({
  selector: 'app-rooms',
  templateUrl: './unit-rooms.component.html',
  styleUrls: ['./unit-rooms.component.css']
})
export class UnitRoomsComponent implements OnInit {
@ViewChild('RoomsForm') form;
mainCap:number=0;
extraCap:number=0;
unid:string;
oid:string;
roomObj:any={
  noSingleBeds:0,
  noQueenBeds:0,
  noKingBeds:0,
  extraSingleBeds:0,
  extraDoubleBeds:0,
  extraLRSingleBeds:0,
  extraLRDoubleBeds:0
};
newUrl:string;
  constructor(private route: ActivatedRoute, private router:Router, private uws:UnitsWizzardService, private us:UnitsService) { 
 
  
 this.route.params.subscribe( params => {
       console.log(params);
       this.uws.setUnid(params['unid']);
       this.unid=params['unid'];
       this.us.getUnitRooms(params['unid']).subscribe(data=>{
        console.log('db data:',data);
        Object.assign(this.roomObj, data);
      });
      });
      this.oid=this.uws.oid;

}

  ngOnInit() {
     this.router.events.subscribe(route => {
          let urlArray=route['url'].toString().split('/');
          urlArray[urlArray.length-1]='pics';
          this.newUrl=urlArray.join('/');
    });
  }
  ngAfterViewInit(){
     //console.log(this.form);
    this.form.control.valueChanges.subscribe(values =>{
      let single, queen, king, extraSingle, extraDouble, extraLRSingleBeds, extraLRDoubleBeds;
      single=values.noSingleBeds?values.noSingleBeds:0;
      queen=values.noQueenBeds?values.noQueenBeds:0;
      king=values.noKingBeds?values.noKingBeds:0;
      extraSingle=values.extraSingleBeds?values.extraSingleBeds:0;
      extraDouble=values.extraDoubleBeds?values.extraDoubleBeds:0;
      extraLRSingleBeds=values.extraLRSingleBeds?values.extraLRSingleBeds:0;
      extraLRDoubleBeds=values.extraLRDoubleBeds?values.extraLRDoubleBeds:0;
      this.mainCap=single+2*queen+2*king;
      this.extraCap=extraSingle+extraLRSingleBeds+2*(extraDouble+extraLRDoubleBeds);
    });
      
  }
    onSubmit(data) {
 event.preventDefault();
     this.us.updateUnitRooms(this.unid, data).then( _ => {
      this.uws.setUnitState(this.unid, 'sobe', 'slike').then( _ => {
        this.router.navigate([this.newUrl]);
      });
     });
   }

}
