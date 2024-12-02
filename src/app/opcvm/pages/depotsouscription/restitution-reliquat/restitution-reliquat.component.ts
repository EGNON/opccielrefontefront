import {Component, EventEmitter, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {Config} from "datatables.net";
import {Subject, Subscription} from "rxjs";
import {DataTableDirective} from "angular-datatables";
import {AuthService} from "../../../../core/modules/auth";
import {LoaderService} from "../../../../loader.service";
import {DepotsouscriptionService} from "../../../services/depotsouscription.service";
import {LocalService} from "../../../../services/local.service";
import {PersonneService} from "../../../../crm/services/personne/personne.service";
import {NgbActiveModal, NgbDate, NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {DateCoursComponent} from "../../../../titresciel/pages/modal/date-cours/date-cours.component";
import {ListeSeanceOpcvmComponent} from "../modal/liste-seance-opcvm/liste-seance-opcvm.component";

@Component({
  selector: 'app-restitution-reliquat',
  templateUrl: './restitution-reliquat.component.html',
  styleUrl: './restitution-reliquat.component.scss'
})
export class RestitutionReliquatComponent implements OnInit, OnDestroy{
  form: FormGroup;

  currentOpcvm: any;
  currentSeance: any;
  currentUser: any;

  submitting = false;
  submitted = false;

  //DataTable Config
  datatableConfigInit: any = {};
  datatableConfig: Config = {};
  dtOptions: any = {};
  dtTrigger: Subject<any> = new Subject();
  @ViewChild(DataTableDirective, {static: false}) datatableElement: DataTableDirective;
  changeTableEvent: EventEmitter<boolean> = new EventEmitter();

  isLoading: boolean = false;
  subscriptions: Subscription[] = [];

  [key: string]: any;

  constructor(
    private authService: AuthService,
    private loadingService: LoaderService,
    private entityService: DepotsouscriptionService,
    private localStore: LocalService,
    private personneService: PersonneService,
    private modalService: NgbModal,
    public modal: NgbActiveModal,
    private fb: FormBuilder,) {
  }

  precalcul() {

  }

  save() {
    return null;
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
    this.subscriptions.forEach((sb) => sb.unsubscribe());
  }

  ngOnInit(): void {
    this.currentUser = this.authService.currentUserValue;
    this.currentOpcvm = this.localStore.getData("currentOpcvm");
    this.currentSeance = this.localStore.getData("currentSeance");
    const dateOuv = new Date(this.currentSeance?.dateOuverture);
    const dateSeance = new Date(this.currentSeance?.dateFermeture);
    this.form = this.fb.group({
      idSeance: [this.currentSeance?.idSeanceOpcvm?.idSeance],
      dateOuverture: [new NgbDate(dateOuv.getFullYear(), dateOuv.getMonth()+1, dateOuv.getDate()),
        Validators.required],
      dateFermeture: [new NgbDate(dateSeance.getFullYear(), dateSeance.getMonth()+1, dateSeance.getDate()),
        Validators.required],
      dateOperation: [new NgbDate(dateSeance.getFullYear(), dateSeance.getMonth()+1, dateSeance.getDate()),
        Validators.required],
      vl: [this.currentSeance?.valeurLiquidative],
    });
    this.datatableConfigInit = {
      // dom: 'Bfrtip',
      dom: "<'row'<'col-sm-12'tr>>" +
        "<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>",
      pagingType: 'simple_numbers',
      buttons: [
        {
          extend:    'copy',
          text:      '<i class="fa fa-files-o"></i> Copier',
          titleAttr: 'Copy',
          className: 'btn btn-default btn-sm'
        },
        {
          extend:    'csv',
          text:      '<i class="fa fa-files-o"></i> Exporter en CSV',
          titleAttr: 'CSV',
          className: 'btn btn-default btn-sm',
          exportOptions: {
            columns: ':visible'
          }
        },
        {
          extend:    'excel',
          text:      '<i class="fa fa-files-o"></i> Exportez en Excel',
          titleAttr: 'Excel',
          className: 'btn btn-default btn-sm',
          exportOptions: {
            columns: ':visible'
          }
        },
        {
          extend:    'pdf',
          text:      '<i class="fa fa-file-pdf"></i> PDF',
          titleAttr: 'PDF',
          className: 'btn btn-default btn-sm',
          exportOptions: {
            columns: ':visible'
          }
        },
        {
          extend:    'print',
          text:      '<i class="fa fa-print"></i> Imprimer',
          titleAttr: 'Print',
          className: 'btn btn-default btn-sm',
          /*autoPrint: false,*/
          exportOptions: {
            columns: ':visible',
            "modifier": {
              "page": 'all'
            }
          }
        },
      ],
      language: {
        processing: '<span class="spinner-border spinner-border-sm align-middle"></span> Chargement...',
        search: "Rechercher&nbsp;:",
        lengthMenu: "Afficher _MENU_ &eacute;l&eacute;ments",
        info: "Affichage de l'&eacute;lement _START_ &agrave; _END_ sur _TOTAL_ &eacute;l&eacute;ments",
        infoEmpty: "Affichage de l'&eacute;lement 0 &agrave; 0 sur 0 &eacute;l&eacute;ments",
        infoFiltered: "(filtr&eacute; de _MAX_ &eacute;l&eacute;ments au total)",
        infoPostFix: "",
        // loadingRecords: "Chargement en cours...",
        zeroRecords: "Aucun &eacute;l&eacute;ment &agrave; afficher",
        emptyTable: "Aucune donnée disponible dans le tableau",
        paginate: {
          first: "Premier",
          previous: "Pr&eacute;c&eacute;dent",
          next: "Suivant",
          last: "Dernier"
        },
        aria: {
          sortAscending: ": activer pour trier la colonne par ordre croissant",
          sortDescending: ": activer pour trier la colonne par ordre décroissant"
        }
      },
    };
  }

  callSeanceModal(param) {
    const modalRef = this.modalService.open(ListeSeanceOpcvmComponent, {
      backdrop: "static",
      size: "xs"
    });
    let dateDebut = this.form.get('dateDebut').value;
    dateDebut = new Date(dateDebut.year, dateDebut.month - 1, dateDebut.day+1);
    let dateFin = this.form.get('dateFin').value;
    dateFin = new Date(dateFin.year, dateFin.month - 1, dateFin.day+1);
    modalRef.componentInstance.dateDebut = dateDebut.toISOString();
    modalRef.componentInstance.dateFin = dateFin.toISOString();
    /*modalRef.componentInstance.passEntry.subscribe((receivedEntry:any) => {
      const dateCours = new Date(receivedEntry.dateCours);
      this.filterForm.patchValue({
        date: new NgbDate(dateCours.getFullYear(), dateCours.getMonth() + 1, dateCours.getDate()),
      });
    });*/
  }
}
