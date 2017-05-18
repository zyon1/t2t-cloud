import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { ActivatedRoute} from '@angular/router';
import { UnitsWizzardService} from '../../units-wizzard.service';

@Component({
  selector: 'app-rooms',
  templateUrl: './unit-rooms.component.html',
  styleUrls: ['./unit-rooms.component.css']
})
export class UnitRoomsComponent implements OnInit {
@ViewChild('RoomsForm') form;
mainCap:number=0;
extraCap:number=0;
  constructor(private route: ActivatedRoute, private uws:UnitsWizzardService) { 
            this.route.params.subscribe( params => {
       console.log(params);
       this.uws.setUnid(params['unid']);
       });}

  ngOnInit() {
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
onChange(newValue) {
    console.log(newValue);
    
    // ... do other stuff here ...
}
}
