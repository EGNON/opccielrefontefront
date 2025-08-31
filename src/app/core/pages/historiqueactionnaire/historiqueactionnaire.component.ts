import {
  AfterContentInit,
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit, Renderer2,
  ViewChild
} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Api, Config} from "datatables.net";
import {of, Subject, Subscription} from "rxjs";
import {DataTableDirective} from "angular-datatables";
import {AuthService} from "../../modules/auth";
import {LocalService} from "../../../services/local.service";
import {LibrairiesService} from "../../../services/librairies.service";
import {ExerciceService} from "../../../opcvm/services/exercice.service";
import {NgbDate} from "@ng-bootstrap/ng-bootstrap";
import moment from "moment/moment";
import * as XLSX from "xlsx";
import {saveAs} from "file-saver";
import {catchError, finalize} from "rxjs/operators";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
    selector: 'app-historiqueactionnaire',
    templateUrl: './historiqueactionnaire.component.html',
    styleUrl: './historiqueactionnaire.component.scss',
    standalone: false
})
export class HistoriqueactionnaireComponent {

}
