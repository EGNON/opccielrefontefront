import {ResourceModel} from "../../crm/models/core/resource.model";
import {Opcvm} from "../../core/models/opcvm";
import {Personne} from "../../crm/models/personne/personne.model";
import {Place} from "../../core/models/place.model";

export class Tarificationordinaire extends  ResourceModel<Tarificationordinaire>{
  idTarificationOrdinaire:number;
  opcvm: Opcvm;
  codeRole:string;
  registraire: Personne;
  place:Place;
  depositaire:Personne;
  borneInferieur:number;
  borneSuperieur:number;
  taux:number;
  forfait:number;

  constructor(model?: Partial<Tarificationordinaire>) {
    super(model);
  }
}
