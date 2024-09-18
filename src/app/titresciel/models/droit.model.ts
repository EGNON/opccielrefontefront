import {TitreModel} from "./titre.model";

export class DroitModel extends TitreModel{
  idActionLiee: number;
  dateDebutNegociation: Date;
  dateFinNegociation: Date;
  idNouvelleAction: number;
  dateJouissance: Date;
  pariteAncienNbre: number;
  pariteAncienCours: number;
  pariteNouveauNbre: number;
  pariteNouveauCourss: number;
  coursTheorique: number;
  prixUnitaireSouscription: number;
  coursActionExDroit: number;

  constructor (model?: Partial<DroitModel>) {
    super(model);
  }
}
