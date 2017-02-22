import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import 'rxjs/add/operator/switchMap';

@Component({
  selector: 'app-errors',
  templateUrl: './errors.component.html',
  styleUrls: ['./errors.component.css']
})
export class ErrorsComponent implements OnInit {
  error:any;
  
   errorMsg:any={"400": 'Bad request!', "401": 'Unauthorized!', "403": 'Forbidden access!', "404": 'Not found!'};
  constructor( private route: ActivatedRoute, private router: Router) { 

  }

  ngOnInit() {
   this.route.params.subscribe(params => {
       this.error = params['id']; 
   });
  }

}
