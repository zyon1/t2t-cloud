import { Component, OnInit } from '@angular/core';
import { ActivatedRoute} from '@angular/router';
import { UnitsWizzardService} from '../../units-wizzard.service';

@Component({
  selector: 'app-unit-data-two',
  templateUrl: './unit-data-two.component.html',
  styleUrls: ['./unit-data-two.component.css']
})
export class UnitDataTwoComponent implements OnInit {

  constructor(private route: ActivatedRoute, private uws:UnitsWizzardService) { 
            this.route.params.subscribe( params => {
       console.log(params);
       this.uws.setUnid(params['unid']);
       });
  }

  ngOnInit() {
  }

}
