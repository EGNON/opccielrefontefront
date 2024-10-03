import {ResourceModel} from "../../../crm/models/core/resource.model";
import {Typeclient} from "./typeclient.model";


export class Soustypeclient extends ResourceModel<Soustypeclient>{
  idSousTypeClient: number;
  intitule: string;
  code: string;
  typeClient:Typeclient;
  constructor(model?: Partial<Soustypeclient>) {
    super(model);
  }
}
