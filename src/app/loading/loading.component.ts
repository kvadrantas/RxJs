import { Component, OnInit } from '@angular/core';
import {Observable} from 'rxjs';
import { LoadingService } from './loading.service';

@Component({
  selector: 'loading',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.css']
})
export class LoadingComponent implements OnInit {


  // We are makiing loadingService public and as well loadingService.loading$ observable also will be public
  constructor(public loadingService: LoadingService) {

  }

  ngOnInit() {
    
  }


}
