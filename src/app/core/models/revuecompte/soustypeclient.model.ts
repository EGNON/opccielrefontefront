import {ResourceModel} from "../../../crm/models/core/resource.model";
import {Typecompte} from "./typecompte.model";
import {Typeclient} from "./typeclient.model";


export class Soustypeclient extends  ResourceModel<Soustypeclient>{
  idSousTypeClient: number;
  libelleSousTypeClient: string;
  codeSousTypeClient: string;
  typeClient:Typeclient;
  constructor(model?: Partial<Soustypeclient>) {
  super(model);
}
}
