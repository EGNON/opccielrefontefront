import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PersonnePhysiqueRoutingModule } from './personne-physique-routing.module';
import { PersonnePhysiqueShowComponent } from './personne-physique-show/personne-physique-show.component';
import { PersonnePhysiqueListComponent } from './personne-physique-list/personne-physique-list.component';
import { PersonnePhysiqueAddEditComponent } from './personne-physique-add-edit/personne-physique-add-edit.component';
import { DeletePersonnePhysiqueModalComponent } from './delete-personne-physique-modal/delete-personne-physique-modal.component';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {PersonnePhysiqueComponent} from "./personne-physique.component";
import {NgbDatepickerModule, NgbDropdownModule, NgbInputDatepicker, NgbModule} from "@ng-bootstrap/ng-bootstrap";
import {SweetAlert2Module} from "@sweetalert2/ngx-sweetalert2";
import {EntityCrudModule} from "../../modules/entity-crud/entity-crud.module";
import {SharedModule} from "../../../template/_metronic/shared/shared.module";
import {CrudModule} from "../../../template/modules/crud/crud.module";
import {DropdownMenusModule} from "../../../template/_metronic/partials";
import { PersonnePhysiqueDetailsComponent } from './personne-physique-details/personne-physique-details.component';
import {NumeroPositifValidatorsDirective} from "../../../validators/numero-positif-validators.directive";
import {NombreDecimalDirective} from "../../../validators/nombre-decimal.directive";


@NgModule({
  declarations: [
    PersonnePhysiqueComponent,
    PersonnePhysiqueShowComponent,
    PersonnePhysiqueListComponent,
    PersonnePhysiqueAddEditComponent,
    DeletePersonnePhysiqueModalComponent,
    PersonnePhysiqueDetailsComponent
  ],
    imports: [
        CommonModule,
        PersonnePhysiqueRoutingModule,
        SharedModule,
        ReactiveFormsModule,
        NgbInputDatepicker,
        NgbDatepickerModule,
        FormsModule,
        CrudModule,
        SweetAlert2Module,
        DropdownMenusModule,
        NgbDropdownModule,
        EntityCrudModule,
        NumeroPositifValidatorsDirective,
        NombreDecimalDirective
    ]
})
export class PersonnePhysiqueModule { }
