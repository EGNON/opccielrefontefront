import {Role} from "./role.model";
import {ResourceModel} from "../core/resource.model";

export class Menu extends ResourceModel<Menu>{
  idMenu!: number;
  icon!: string;
  dataLink!: string;
  page!: string;
  title!: string;
  estActif!: boolean;
  translate!: string;
  ordreAffichage!: number;
  role!: Role;
  parentMenu!: Menu;
  children!: Menu[];

  constructor(model?: Partial<Menu>) {
    super(model);
  }
}
