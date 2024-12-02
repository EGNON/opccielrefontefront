import {ResourceModel} from "../../crm/models/core/resource.model";
import {Opcvm} from "../../core/models/opcvm";
import { Natureoperation } from "../../core/models/natureoperation.model";
import { Personne } from "../../crm/models/personne/personne.model";
import { Transaction } from "./Transaction.model";

export class Operationpaiementrachat2 extends  ResourceModel<Operationpaiementrachat2>{
  idOpcvm:number;
  idSeance:number;
  idActionnaire:number;
  nomSigle:string;
  prenomRaisonSociale:string;
  montant:number;
  constructor(model?: Partial<Operationpaiementrachat2>) {
    super(model);
  }
}
