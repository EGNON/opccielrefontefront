import * as events from "events";
import {Injectable} from "@angular/core";

@Injectable({
  providedIn: 'root'
})
export class NumbersAuthaurization {

   verifNumber(id:string,evt:any){
     // @ts-ignore
     document.getElementById(id).onkeypress = function() {myFunction()};
     function verif() {
       var keyCode = evt.which ? evt.which : evt.keyCode;
       var accept = '0123456789';
       if (accept.indexOf(String.fromCharCode(keyCode)) >= 0) {
         return true;
       } else {
         return false;
       }
     }
     function myFunction(){
       return verif();
     }
   }
}
