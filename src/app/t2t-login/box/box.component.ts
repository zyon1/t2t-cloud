import { Component, OnInit, Input } from '@angular/core';
import { GroupService } from '../group.service';
@Component({
  selector: 'app-box',
  templateUrl: './box.component.html',
  styleUrls: ['./box.component.css']
})
export class BoxComponent implements OnInit {
@Input('content')content:any;

  constructor(private gs:GroupService) {

   }

  ngOnInit() {
  }
setActiveGid(gid){
this.gs.setGroup(gid);
}
}
