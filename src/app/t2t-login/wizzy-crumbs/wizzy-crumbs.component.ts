import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params} from '@angular/router';

@Component({
  selector: 'app-wizzy-crumbs',
  templateUrl: './wizzy-crumbs.component.html',
  styleUrls: ['./wizzy-crumbs.component.css']
})
export class WizzyCrumbsComponent implements OnInit {
 oid:string="";
  uid:string="";
  gid:string="";
  unid:string="";
  constructor(private route: ActivatedRoute, private router: Router) { 
   
  }
  ngOnInit() {
    this.route.params.subscribe(params => {
      this.uid=params['id'];
      this.gid=params['gid'];
      this.oid=params['oid'];
      console.log(this.uid, this.oid, this.gid);
    });
    this.route.params.subscribe(params=>
    {
      //console.log(this.route.params);

            this.unid=params['unid'];

      console.log( this.unid);
      }
    );
  }

}

