import { Address } from './address';
import { FirebaseUserConfig} from 'angularfire2';
/*
export class Address {
    ulica: string;
    mjesto: string;
    postbr: number;
    drzava: string;
}
 */

class T2tUserInit {
  created: number;
  isAdmin: boolean;
  touched: boolean;
  activated: boolean;
}
class T2tUser implements Address {
  ime: string;
  prezime: string;
  oib: number;
  obrtnik: boolean;
  imeObrta: string;
  group: string;
}


export class User {
    t2tUser:T2tUser;
    firebaseUser: any;
    /*t2tUserInit : T2tUserInit;
    t2tUser : T2tUser;*/
    setFbUser(user:any){
        this.firebaseUser=user;
        }
}





