import {ResourceModel} from "./core/resource.model";

export class Degre extends ResourceModel<Degre> {
  idDegre!: number;
  libelle!: string;

  constructor(model?: Partial<Degre>) {
    super(model);
  }
}
