import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params} from '@angular/router';
@Component({
  selector: 'app-units-wizard',
  templateUrl: './units-wizard.component.html',
  styleUrls: ['./units-wizard.component.css']
})
export class UnitsWizardComponent implements OnInit {
  oid:string="";
  uid:string="";
  gid:string="";
  constructor(private route: ActivatedRoute, private router: Router) { 
    this.route.params.subscribe(params=>
    {
      this.oid=params['oid'];
      this.gid=params['gid'];
      this.uid=params['id'];
      console.log(this.gid, this.uid, this.oid);
      }
    );
  }

  ngOnInit() {
  }

}
