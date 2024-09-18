import {AbstractControl, FormControl, ValidationErrors} from "@angular/forms";

export class AppValidators {
  //Validation des espaces
  static notOnlyWhitespace(control: AbstractControl): ValidationErrors | null {
    //Vérifier si la chaîne contient uniquement des espaces
    if((control.value != null) && (control.value.trim().length === 0))
    {
      //Retourne un objet comme erreur lorsque invalide
      return { notOnlyWhitespace: true };
    }
    //Retourne null lorsque valide
    return null;
  }
}
