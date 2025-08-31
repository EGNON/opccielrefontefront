import { Directive } from '@angular/core';
import {
  AbstractControl,
  AsyncValidator,
  NG_ASYNC_VALIDATORS,
  NG_VALIDATORS,
  ValidationErrors,
  Validator
} from "@angular/forms";
import {lastValueFrom, Observable} from "rxjs";
import {environment} from "../../../../environments/environment";
import {PersonneService} from "../../../crm/services/personne/personne.service";

@Directive({
    selector: '[appNumeroCompteDepositaire]',
    providers: [
        {
            provide: NG_ASYNC_VALIDATORS,
            useExisting: NumeroCompteDepositaireDirective,
            multi: true
        }
    ],
    standalone: false
})
export class NumeroCompteDepositaireDirective implements AsyncValidator{

  constructor(public personneService:PersonneService) {
  }
  validate(control: AbstractControl<string> ): Promise<ValidationErrors | null> {
      console.log(control.value)
    return new Promise((resolve, reject) => {
      this.personneService.
          afficherPersonneSelonNumeroCpteDepositaire(control.value).subscribe({
        next: data => {
          let resultat=null;
          console.log("data==",data)
          if(data.length>0){
            console.log("passez")
            resultat={
              appNumeroCompteDepositaire:true
            }
          }
          return resultat;
        },
        error: err => {
          reject(err);
        }
      });
    })
  }
}
