import {Component, EventEmitter, OnDestroy, OnInit, Output} from '@angular/core';
import {Config} from "datatables.net";
import {Subscription, tap} from "rxjs";
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";
import moment from "moment/moment";
import $ from "jquery";
import {LocalService} from "../../../../../services/local.service";
import {SeanceopcvmService} from "../../../../services/seanceopcvm.service";

@Component({
  selector: 'app-liste-seance-opcvm',
  templateUrl: './liste-seance-opcvm.component.html',
  styleUrl: './liste-seance-opcvm.component.scss'
})
export class ListeSeanceOpcvmComponent implements OnInit, OnDestroy{
  [key: string]: any;

  currentOpcvm: any;
  currentSeance: any;

  @Output() passEntry: EventEmitter<any> = new EventEmitter();

  //DataTable Config
  datatableConfig: Config = {};
  dtOptions: any = {};

  //Get all subscriptions
  private subscriptions: Subscription[] = [];

  constructor(
    private entityService: SeanceopcvmService,
    public modal: NgbActiveModal,
    private localStore: LocalService,) {
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sb) => sb.unsubscribe());
  }

  ngOnInit(): void {
    this.currentOpcvm = this.localStore.getData("currentOpcvm");
    this.currentSeance = this.localStore.getData("currentSeance");
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
      retrieve: true,
      stateSave: true,
      destroy: true
    };
    this.afficherListe();
  }

  btnScripts(n: any) {
    this.passEntry.emit(n);
    this.modal.dismiss();
  }

  afficherListe() {
    const self = this;
    const columns: any[] = [
      {
        sortable: false,
        title: 'Actions',
        class:'text-center min-w-10px',
        render: (data: any, type: any, full: any) => {
          return `<button class="btn btn-primary btn-sm">Choisir</button>`;
        },
      },
      {
        title: 'N°', data: 'idSeance', render: function (data, type, row) {
          return row.idSeanceOpcvm.idSeance;
        },
      },
      {
        title: 'Date Ouv.', data: 'dateOuverture', render: function (data, type, row) {
          return moment(data).format('DD/MM/YYYY');
        },
      },
      {
        title: 'Date Ferm.', data: 'dateFermeture', render: function (data, type, row) {
          return moment(data).format('DD/MM/YYYY');
        },
      },
      {
        title: 'VL', data: 'valeurLiquidative', render: function (data, type, row) {
          return row.valeurLiquidative?.toLocaleString('fr-FR', {minimumFractionDigits:6, maximumFractionDigits:6});
        },
      },
      {
        title: 'E ?', data: "estEnCours", render: function(data, type, row){
          if(row.estEnCours) {
            return `<div class="form-check form-check-custom form-check-solid form-check-success form-switch">
                      <div class="form-check form-check-custom form-check-solid form-switch mb-2">
                        <input disabled="disabled" name="estEnCours" type="checkbox" class="form-check-input"
                            value="${row.estEnCours}" checked>
                      </div>
                    </div>`;
          }
          else {
            return `<div class="form-check form-check-custom form-check-solid form-check-success form-switch">
                      <div class="form-check form-check-custom form-check-solid form-switch mb-2">
                        <input disabled="disabled" name="estEnCours" type="checkbox" class="form-check-input"
                            value="${row.estEnCours}">
                      </div>
                    </div>`;
          }
        }
      }
    ];
    this.datatableConfig = {
      serverSide: true,
      ajax: (dataTablesParameters: any, callback) => {
        const sb = this.entityService.listeSeanceOpcvm(dataTablesParameters, this.currentOpcvm?.idOpcvm)
        .subscribe(resp => {
          console.log(resp.data);
          callback(resp.data);
        });
        this.subscriptions.push(sb);
      },
      columns: columns,
      createdRow: function (row, data, dataIndex) {
        $(row).find('.btn').on('click', () => self.btnScripts(data));
      },
    };
    this.dtOptions = {
      ...this.dtOptions,
      ...this.datatableConfig,
    }
  }
}
