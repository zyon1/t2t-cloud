import { Component, OnInit } from '@angular/core';
import { CustomSelectComponent } from '../../custom-select/custom-select.component';
import { ActivatedRoute} from '@angular/router';
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
  constructor(private route: ActivatedRoute, private uws:UnitsWizzardService, private us:UnitsService) { 
        this.route.params.subscribe( params => {
       console.log(params);
       this.uws.setUnid(params['unid']);
      });
      this.oid=this.uws.oid;
  }
  
  ngOnInit() {
  }
  onSubmit(data) {
     console.log(data);
     this.us.updateObjectPolicies(this.oid, data);
     this.uws.setObjectState(this.oid, {politika:{completed: true, available:true}, slike:{available:true}});
   }
}
