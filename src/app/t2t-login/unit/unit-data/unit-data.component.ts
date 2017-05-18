import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params} from '@angular/router';
import { UnitsWizzardService} from '../../units-wizzard.service';

@Component({
  selector: 'app-unit-data',
  templateUrl: './unit-data.component.html',
  styleUrls: ['./unit-data.component.css']
})
export class UnitDataComponent implements OnInit {
  uid:string;
  oid:string;
  gid:string;
  unid:string="";
  constructor(private route: ActivatedRoute, private router: Router, private uws: UnitsWizzardService) { 
   
  }

  ngOnInit() {
    this.route.parent.parent.params.subscribe(params => {
      this.uid=params['id'];
      this.gid=params['gid'];
      this.oid=params['oid'];
      //console.log(this.uid, this.oid, this.gid);
    });
    this.route.params.subscribe(params=>
    {
      //console.log(this.route.params);
            this.uws.setUnid(params['unid']);
            this.unid=params['unid'];

     // console.log( 'unid',this.unid);
      }
    );
    //console.log(this.router);
  }

}
