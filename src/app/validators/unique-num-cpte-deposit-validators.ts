import {HostListener, Injectable} from "@angular/core";
import {
  AbstractControl,
  AsyncValidatorFn,
  FormControl,
  FormControlName,
  ValidationErrors,
  ValidatorFn
} from "@angular/forms";
import {PersonneService} from "../crm/services/personne/personne.service";

@Injectable()
export class UniqueNumCpteDepositValidators {
  // acceptedCharacters: string[] = ['.', ',', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
  constructor(private personneService: PersonneService) {
  }

  numeroCompteDepositValidators(id: any): ValidatorFn {
    return (ctrl: AbstractControl): null | ValidationErrors => {
      // if (!ctrl.get(numeroCpteDeposit) || !ctrl.get(id)) {
      //   return {
      //     idEqual: 'Invalid control names'
      //   };
      // }
      const numeroCpteDepositValue = ctrl.value;
      // const idValue = ctrl.get(id)!.value;
      if(id===undefined || id===0 || id===null){
        return (new Promise((resolve, reject) => {
          if (numeroCpteDepositValue) {
            this.personneService.existeSelonNumCpteDeposit(numeroCpteDepositValue).subscribe((response: any) => {
              resolve(response);
            }, reject);
          }
        })).then((resp: any) => {
          let result = null;
          if (resp) {
            return {uniqueCpte: true};
          }
          return null;
        });
      } else {
        return (new Promise((resolve, reject) => {
          if (numeroCpteDepositValue) {
            this.personneService.afficherPersonneSelonId(id).subscribe((response) => {
              resolve(response);
            }, reject);
          }
        })).then((resp: any) => {
          if (resp != null && resp.numeroCpteDeposit !== numeroCpteDepositValue) {
            return (new Promise((resolve, reject) => {
              if (numeroCpteDepositValue) {
                this.personneService.existeSelonNumCpteDeposit(numeroCpteDepositValue).subscribe((response: any) => {
                  resolve(response);
                }, reject);
              }
            })).then((resp: any) => {
              let result = null;
              if (resp) {
                return {uniqueCpte: true};
              }
              return null;
            });
            //return {uniqueCpte: true};
          }
          return null;
        });
      }
    };
  }

  uniqueNumCpteDepositaire = (id: any) => {
    this.uniqueNumCpteDepositValidator;
  }
  uniqueNumCpteDepositValidator: AsyncValidatorFn = (control: AbstractControl<string>) => {
    return (new Promise((resolve, reject) => {
      if (control.value) {
        this.personneService.existeSelonNumCpteDeposit(control.value).subscribe((response: any) => {
          resolve(response);
        }, reject);
      }
    })).then((resp: any) => {
      if (resp) {
        return {uniqueCpte: true};
      }
      return null;
    });
  }

  _keyUp(event: any) {
    let acceptedCharacters: string[] = ['.', ',', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
    if (!acceptedCharacters.includes(event.key)) {
      event.preventDefault();
    }
  }

  @HostListener('keypress', ['$event']) onInput(event: KeyboardEvent): void {
    const pattern = /[0-9\+\-\ ]/;
    let inputChar = String.fromCharCode(Number(event.key));

    if (!pattern.test(inputChar)) {
      // invalid character, prevent input
      event.preventDefault();
    }
    // if (!this.acceptedCharacters.includes(event.key)) {
    //   event.preventDefault();
    // }
  }
}
