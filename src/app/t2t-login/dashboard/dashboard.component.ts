import { Component, OnInit, Input } from '@angular/core';
import { LoginService } from '../login.service';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
@Input('uid')uid:any;
  constructor(private ls:LoginService) { 
    this.ls.getLoggedUser().subscribe(auth=>this.uid=auth.uid);
  }

  ngOnInit() {
  }

}
