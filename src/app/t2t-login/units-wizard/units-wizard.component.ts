import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params} from '@angular/router';
import { UnitsWizzardService } from '../units-wizzard.service';
@Component({
  selector: 'app-units-wizard',
  templateUrl: './units-wizard.component.html',
  styleUrls: ['./units-wizard.component.css']
})
export class UnitsWizardComponent implements OnInit {
  oid:string="";
  uid:string="";
  gid:string="";
  unid:string="";
  urlArray:any[];
  objUrl:string="";
  unitUrl:string;
  roomUrl:string;
  priceUrl:string;
  constructor(private route: ActivatedRoute, private router: Router, private uws:UnitsWizzardService ) { 
    this.uws.recieveChange().subscribe(x=> { console.log(x)});
   this.urlArray= this.router.routerState.snapshot.url.split("/");
   this.unid=this.urlArray[10]?this.urlArray[10]:null;
   console.log(this.urlArray);
   let i=0;
   this.urlArray.forEach(segment => {
     //console.log(segment);
     if(i<=8){this.objUrl+=(segment!=''?'/':'') + segment;}
     i++;
   });
   this.unitUrl=this.objUrl+'/units';
   console.log(this.objUrl, 'unit:', this.unitUrl);
  }

  ngOnInit() {
    
          //console.log(this.route);
//console.log(this.route.url);
     this.route.params.subscribe(params=>
    {

      console.log(this.route.params);
      this.oid=params['oid'];
      this.gid=params['gid'];
      this.uid=params['id'];
      console.log(this.gid, this.uid, this.oid);
      }
    );
    //console.log(this.router);
    
  }

}
