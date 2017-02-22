import 'rxjs/Rx';
import { Injectable } from '@angular/core';
import {Observable, Subject} from 'rxjs/Rx';
import { User } from './common/user';
// import { Credentials } from '../common/credentials';

  
@Injectable()
export class PaginationService {
    initialArray:any[];
    paginatedArray:any[];
    noPages:number;
    constructor( ) {
        
    }
    paginate( pageSize:number, array?:any[]){
        if(typeof array != 'undefined' ){this.initialArray=array;}
        this.paginatedArray=[];
        let arrSize=this.initialArray.length;
        this.noPages=Math.ceil(arrSize/pageSize);

        for (let i=0; i<(this.noPages+1);i++){
            this.paginatedArray.push(this.initialArray.slice(i*(pageSize), (i+1)*(pageSize)));
        }
        return this.paginatedArray;
    }
    goToPage(page){
        //console.log(this.paginatedArray[(page-1)]);
        return this.paginatedArray[(page-1)];
    }
  
    
}