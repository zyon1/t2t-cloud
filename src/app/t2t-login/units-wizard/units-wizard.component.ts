import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params} from '@angular/router';
@Component({
  selector: 'app-units-wizard',
  templateUrl: './units-wizard.component.html',
  styleUrls: ['./units-wizard.component.css']
})
export class UnitsWizardComponent implements OnInit {

  constructor(private route: ActivatedRoute, private router: Router) { }

  ngOnInit() {
  }

}
