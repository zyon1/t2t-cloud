import { Component, OnInit, Input } from '@angular/core';
import { Router, ActivatedRoute, Params} from '@angular/router';


@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
uid:string;
  constructor(private route: ActivatedRoute, private router: Router) { }

  ngOnInit() {
     this.route.params.subscribe( params => {
       this.uid=params['uid'];
     });
  }

}
