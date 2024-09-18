import {ResourceModel} from "../../crm/models/core/resource.model";
export class Transaction extends ResourceModel<Transaction>{
  idOperation:number;
  sigleOpcvm:string;
  denominationOpcvm:string;
  nomPays:string;
  qtePart:number;
  montant:number;
  constructor(model?: Partial<Transaction>) {
    super(model);
  }
}
