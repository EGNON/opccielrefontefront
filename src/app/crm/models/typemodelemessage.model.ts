import {BaseModel} from "./base.model";
import {ResourceModel} from "./core/resource.model";
import {Typemodele} from "./typemodele.model";
import {ModeleMsgAlerte} from "./modelemsgalerte.model";

export class Typemodelemessage extends ResourceModel<Typemodelemessage>{
  idTypeModeleMessage: number;
  typeModele: Typemodele;
  modeleMsgAlerte:ModeleMsgAlerte;
  defaut:boolean;
  dateTypeModeleMessage:Date;
  constructor(model?: Partial<Typemodelemessage>) {
    super(model);
  }
}
