import {Component, EventEmitter, OnDestroy, OnInit, Output} from '@angular/core';
import {Config} from "datatables.net";
import {Subscription, tap} from "rxjs";
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";
import moment from "moment/moment";
import {map} from "rxjs/operators";
import $ from "jquery";

@Component({
  selector: 'app-liste-seance-opcvm',
  templateUrl: './liste-seance-opcvm.component.html',
  styleUrl: './liste-seance-opcvm.component.scss'
})
export class ListeSeanceOpcvmComponent implements OnInit, OnDestroy{
  [key: string]: any;

  @Output() passEntry: EventEmitter<any> = new EventEmitter();

  //DataTable Config
  datatableConfig: Config = {};
  dtOptions: any = {};

  //Get all subscriptions
  private subscriptions: Subscription[] = [];

  constructor(public modal: NgbActiveModal,) {
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sb) => sb.unsubscribe());
  }

  ngOnInit(): void {
    this.dtOptions = {
      // dom: 'Bfrtip',
      dom: "<'row'<'col-sm-12'tr>>" +
        "<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>",
      /*order: [0, 'desc'],*/
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
  }

  afficherListe() {
    const self = this;
    /*this.datatableConfig = {
      serverSide: true,
      ajax: (dataTablesParameters: any, callback) => {
        const verificationListeDepotRequest = {
          seanceOpcvmDto: this.currentSeance,
          opcvmDto: this.currentOpcvm,
          datatableParameters: dataTablesParameters,
          estVerifier: null,
          estVerifie1: false,
          estVerifie2: false
        };

        const sb = this.entityService.verificationListeDepot(verificationListeDepotRequest)
          .subscribe(resp => {
            const depots: any[] = resp.data.data;
            self.disableSaveBtn = depots.filter(d => d.estVerifier) != null ? depots.filter(d => d.estVerifier).length > 0 : false;
            callback(resp.data);
          });
        this.subscriptions.push(sb);
      },
      columns: [
        {
          title: 'Référence', data: 'referencePiece', render: function (data, type, row) {
            return row.referencePiece;
          },
        },
        {
          title: 'Date Opération', data: 'dateOperation', render: function (data, type, row) {
            return moment(data).format('DD/MM/YYYY');
          },
        },
        {
          title: 'Dénomination', data: 'denomination', render: function (data, type, row) {
            return row.actionnaire.denomination || '';
          },
        },
        {
          title: 'Montant Déposé', data: 'montant', render: function (data, type, row) {
            return row.montant.toLocaleString('fr-FR', {minimumFractionDigits:6, maximumFractionDigits:6});
          },
        },
        {
          title: 'Montant Souscrit', data: 'montantSouscrit', render: function (data, type, row) {
            return row.montant.toLocaleString('fr-FR', {minimumFractionDigits:6, maximumFractionDigits:6});
          },
        },
        {
          title: 'Vérifié ?', data: "estVerifier", render: function(data, type, row){
            return `<div class="form-check form-check-custom form-check-solid form-check-success form-switch">
                      <div class="form-check form-check-custom form-check-solid form-switch mb-2">
                        <input disabled="disabled" name="estVerifier" type="checkbox" class="form-check-input"
                            value="true" checked>
                      </div>
                    </div>`;
          }
        }
      ],
      createdRow: function (row, data, dataIndex) {
        const listeVerifDepotForm = self.createListeVerifDepotForm();
        const depotClone: any = {
          ...data,
          estVerifier: true,
          dateVerification: new Date(),
          nomVerificateur: "User",
          estVerifie1: false,
          estVerifie2: false,
        };
        for (const key in depotClone) {
          let value = depotClone[key];
          if(key.includes("date")) {
            value = new Date(value);
          }
          self.ajouterFormControl(listeVerifDepotForm, key, value, []);
        }
        self.depots.push(listeVerifDepotForm);
        $('td', row).find('input').on('change', (e) => {
          self.form.patchValue({[e.target.name]: +e.target.value!});
        });
      },
    };
    this.dtOptions = {
      ...this.dtOptions,
      ...this.datatableConfig,
    }*/
  }
}
