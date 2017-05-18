import { Component, OnInit } from '@angular/core';
import { ActivatedRoute} from '@angular/router';
import { UnitsWizzardService} from '../../units-wizzard.service';
@Component({
  selector: 'app-unit-data-three',
  templateUrl: './unit-data-three.component.html',
  styleUrls: ['./unit-data-three.component.css']
})
export class UnitDataThreeComponent implements OnInit {

  constructor(private route: ActivatedRoute, private uws:UnitsWizzardService) { 
            this.route.params.subscribe( params => {
       console.log(params);
       this.uws.setUnid(params['unid']);
       });
  }
  ngOnInit() {
  }

}
