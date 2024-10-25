import {ResourceModel} from "../../crm/models/core/resource.model";
import {Opcvm} from "../../core/models/opcvm";
import { Natureoperation } from "../../core/models/natureoperation.model";
import { Personne } from "../../crm/models/personne/personne.model";

export class Seanceopcvm extends  ResourceModel<Seanceopcvm>{
  opcvm:Opcvm;
  idSeance:number;
  dateOuverture:Date;
  dateFermeture:Date;
  genere:boolean;
  typeSeance:string;
  valeurLiquidative:number;
  estEnCours:boolean;
  niveau:number;
  estEnCloture:boolean;
  navBenchmark:number;
  tauxEquiMarche:number  ;

  constructor(model?: Partial<Seanceopcvm>) {
    super(model);
  }
}
