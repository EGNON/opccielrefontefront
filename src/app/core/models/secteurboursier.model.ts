import {ResourceModel} from "../../crm/models/core/resource.model";


export class Secteurboursier extends  ResourceModel<Secteurboursier>{
  idSecteurBoursier: number;
  libelleSecteurBoursier: string;

  constructor(model?: Partial<Secteurboursier>) {
  super(model);
}
}
