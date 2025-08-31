import {AfterViewInit, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {FormArray, FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Api, Config} from "datatables.net";
import {fromEvent, of, Subject, Subscription} from "rxjs";
import {DataTableDirective} from "angular-datatables";
import {AuthService} from "../../../../core/modules/auth";
import {LocalService} from "../../../../services/local.service";
import {NgbDate} from "@ng-bootstrap/ng-bootstrap";
import {OperationsouscriptionrachatService} from "../../../services/operationsouscriptionrachat.service";
import moment from "moment";
import {catchError, finalize, map} from "rxjs/operators";
import $ from "jquery";

@Component({
    selector: 'app-avis-souscription',
    templateUrl: './avis-souscription.component.html',
    styleUrl: './avis-souscription.component.scss',
    standalone: false
})
export class AvisSouscriptionComponent implements OnInit, AfterViewInit, OnDestroy{
  form: FormGroup;
  listeAvisForm: any

  currentOpcvm: any;
  currentSeance: any;
  currentUser: any;

  downloading = false;
  downloaded = false;
  submitting = false;
  submitted = false;

  //DataTable Config
  datatableConfig: Config = {};
  dtOptions: any = {};
  dtTrigger: Subject<any> = new Subject();
  @ViewChild(DataTableDirective, {static: false}) datatableElement: DataTableDirective;

  isLoading: boolean = false;
  subscriptions: Subscription[] = [];

  [key: string]: any;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private localStore: LocalService,
    private entityService: OperationsouscriptionrachatService,
    private cdr: ChangeDetectorRef,
  ) {
    this.currentUser = this.authService.currentUserValue;
    this.currentOpcvm = this.localStore.getData("currentOpcvm");
    this.currentSeance = this.localStore.getData("currentSeance");
  }

  get avis(): FormArray {
    return <FormArray>this.form.get('avis');
  }

  createListeAvisForm() {
    return this.fb.group({});
  }

  ajouterFormControl(elt: any, fieldName: string, fieldValue: any, validators: any[] = []) {
    elt.addControl(fieldName, this.fb.control(fieldValue, validators));
  }

  afficherListe(prefix: string) {
    const self = this;
    let columns: any[] = [
      {
        sortable: false,
        title: `<div class="form-check form-check-custom form-check-solid form-check-success form-switch">
                  <div class="form-check form-check-custom form-check-solid form-switch mb-2">
                    <input name="chekAll" type="checkbox" class="form-check-input"
                        value="false">
                  </div>
                </div>`,
        class: 'text-end min-w-10px',
        render: (data: any, type: any, full: any) => {
          return `<div class="form-check form-check-custom form-check-solid form-check-success form-switch">
                    <div class="form-check form-check-custom form-check-solid form-switch mb-2">
                      <input name="chekLigne" type="checkbox" class="form-check-input"
                          value="false">
                    </div>
                  </div>`;
        },
      },
      {
        title: 'ID.', data: 'idOperation', render: function (data, type, row) {
          return row.idOperation;
        },
      },
      {
        title: 'DATE OP.', data: 'dateOperation', render: function (data, type, row) {
          return moment(data).format('DD MMM YYYY à HH:mm:ss');
        },
      },
      {
        title: 'DATE VALEUR', data: 'dateValeur', render: function (data, type, row) {
          return moment(data).format('DD MMM YYYY à HH:mm:ss');
        },
      },
      {
        title: 'OPERATION', data: 'libelleOperation', render: function (data, type, row) {
          return row.libelleOperation || '';
        },
      },
      {
        title: 'ACTIONNAIRE', data: 'denomination', render: function (data, type, row) {
          return row.actionnaire?.denomination || '';
        },
      },
      {
        title: 'MONTANT DEPOSE', data: 'montantDepose', render: function (data, type, row) {
          return row.montantDepose?.toLocaleString('fr-FR', {minimumFractionDigits:6, maximumFractionDigits:6});
        },
      },
      {
        title: 'VL', data: 'coursVL', render: function (data, type, row) {
          return row.coursVL?.toLocaleString('fr-FR', {minimumFractionDigits:6, maximumFractionDigits:6});
        },
      },
      {
        title: 'PARTS', data: 'nombrePartSousRachat', render: function (data, type, row) {
          return row.nombrePartSousRachat?.toLocaleString('fr-FR', {minimumFractionDigits:6, maximumFractionDigits:6});
        },
      },
      {
        title: 'COMMISSIONS', data: 'commisiionSousRachat', render: function (data, type, row) {
          return row.commisiionSousRachat?.toLocaleString('fr-FR', {minimumFractionDigits:6, maximumFractionDigits:6});
        },
      },
      {
        title: 'MONTANT SOUSCRIT', data: 'montantSousALiquider', render: function (data, type, row) {
          return row.montantSousALiquider?.toLocaleString('fr-FR', {minimumFractionDigits:6, maximumFractionDigits:6});
        },
      }
    ];
    self.avis.clear();
    this.datatableConfig = {
      processing: true,
      serverSide: true,
      ajax: (dataTablesParameters: any, callback) => {
        let idOpcvm = this.currentOpcvm?.idOpcvm;
        let idSeance = this.currentSeance?.idSeanceOpcvm?.idSeance;
        let param = {
          idOpcvm: idOpcvm,
          ...this.form.value,
          codeNatureOperation: "SOUS_PART",
          datatableParameters: dataTablesParameters
        };
        if(prefix.toLowerCase() === "p") {
          /*const sb = this.reliquatService.precalculRestitutionReliquat(
            dataTablesParameters, this.currentOpcvm?.idOpcvm, this.form.value.idSeance)
            .subscribe(resp => {
              callback(resp.data);
            });
          this.subscriptions.push(sb);*/
        }
        else if (prefix.toLowerCase() === "l") {
          param = {
            ...param,
            dateDebut: new Date(param.dateDebut.year, param.dateDebut.month-1, param.dateDebut.day+1),
            dateFin: new Date(param.dateFin.year, param.dateFin.month-1, param.dateFin.day+1),
          };
          const sb = this.entityService.listeOpSousRach(param)
          .subscribe(resp => {
            callback(resp.data);
          });
          this.subscriptions.push(sb);
        }
        else {
          callback({
            draw: dataTablesParameters.draw,
            recordsTotal: 1,
            recordsFiltered: 1,
            data: []
          });
        }
      },
      columns: columns,
      createdRow: function (row, data: any, dataIndex) {
        $(row).find('.form-check-input').on('click', (e) => {
          const checkbox = $(e.target);
          const checked = checkbox.is(':checked');
          if(checked) {
            const listeAvisForm = self.createListeAvisForm();
            const opSousRach: any = {
              ...data,
            };
            for (const key in opSousRach) {
              let value = opSousRach[key];
              if(key.includes("date")) {
                value = new Date(value);
              }
              self.ajouterFormControl(listeAvisForm, key, value, []);
            }
            self.avis.push(listeAvisForm);
          }
        });
      },
    };
    this.dtOptions = {
      ...this.dtOptions,
      ...this.datatableConfig,
    };
    this.rerender();
  }

  rerender(): void {
    try {
      this.datatableElement.dtInstance.then((dtInstance: Api) => {
        dtInstance.destroy();
        this.dtTrigger.next(null);
      });
    } catch (err) {
      // console.log(err);
    }
    // this.cdr.detectChanges();
  }

  actualiser() {
    this.afficherListe("l");
  }

  telecharger() {
    this.downloading = true;
    const sb = this.entityService.telechargerAvisSouscription(this.form.value.avis)
      .pipe(
        catchError((err) => {
          this.downloading = false;
          return of(err.message);
        }),
        finalize(() => {
          this.downloading = false;
          this.downloaded = false;
        })
      )
      .subscribe((response: any) => {
        console.log("Ici le retour attendu !!", response);
        /*const linkSource =
          'data:application/octet-stream;base64,' + response.data;
        const downloadLink = document.createElement('a');
        const fileName = 'listVerifDepot.pdf';

        downloadLink.href = linkSource;
        downloadLink.download = fileName;
        downloadLink.click();*/
      });
    this.subscriptions.push(sb);
  }

  triggerFilter() {
    fromEvent<KeyboardEvent>(document, 'keyup')
      .pipe(
        //debounceTime(50),
        map(event => {
          const target = event.target as HTMLElement;
          const action = target.getAttribute('data-action');
          const value = (target as HTMLInputElement).value?.trim().toLowerCase();

          return {action, value};
        })
      )
      .subscribe(({action, value}) => {
        if (action === 'filter') {
          console.log("RECHERCHE === ", value);
          this.datatableElement.dtInstance.then(dtInstance => dtInstance.search(value).draw());
        }
      });
  }

  ngAfterViewInit(): void {
    this.triggerFilter();
    this.dtTrigger.next(null);
  }

  ngOnDestroy(): void {
  }

  ngOnInit(): void {
    const dateOuv = new Date(this.currentSeance?.dateOuverture);
    const dateSeance = new Date(this.currentSeance?.dateFermeture);
    this.form = this.fb.group({
      idSeance: [this.currentSeance?.idSeanceOpcvm?.idSeance],
      dateDebut: [
        new NgbDate(dateOuv.getFullYear(), dateOuv.getMonth()+1, dateOuv.getDate()), Validators.required
      ],
      dateFin: [
        new NgbDate(dateSeance.getFullYear(), dateSeance.getMonth()+1, dateSeance.getDate()), Validators.required
      ],
      avis: this.fb.array([this.createListeAvisForm()]),
    });
    this.dtOptions = {
      // dom: 'Bfrtip',
      dom: "<'row'<'col-sm-12'tr>>" +
        "<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>",
      /*order: [0, 'desc'],*/
      pagingType: "simple_numbers",
      lengthMenu: [[10, 25, 50, -1], [10, 25, 50, "All"]],
      lengthChange: false,
      responsive: true,
      buttons: [
        {
          extend:    'copy',
          text:      '<i class="fa fa-files-o"></i> Copier',
          titleAttr: 'Copy',
          className: 'btn btn-default btn-sm d-none'
        },
        {
          extend:    'csv',
          text:      '<i class="fa fa-files-o"></i> CSV',
          titleAttr: 'CSV',
          className: 'btn btn-default btn-sm d-none',
          exportOptions: {
            columns: ':visible'
          }
        },
        {
          extend:    'excel',
          text:      '<i class="fa fa-files-o"></i> Excel',
          titleAttr: 'Excel',
          className: 'btn btn-default btn-sm d-none',
          exportOptions: {
            columns: ':visible'
          }
        },
        {
          extend:    'pdf',
          text:      '<i class="fa fa-file-pdf"></i> PDF',
          titleAttr: 'PDF',
          className: 'btn btn-default btn-sm d-none',
          exportOptions: {
            columns: ':visible'
          }
        },
        {
          extend:    'print',
          text:      '<i class="fa fa-print"></i> Imprimer',
          titleAttr: 'Print',
          className: 'btn btn-default btn-sm d-none',
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
        loadingRecords: "Chargement en cours...",
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
    this.afficherListe("l");
    this.listeAvisForm = this.createListeAvisForm();
  }
}
