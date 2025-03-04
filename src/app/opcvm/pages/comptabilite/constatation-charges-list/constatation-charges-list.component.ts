import {AfterViewInit, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup} from "@angular/forms";
import {DataTableDirective} from "angular-datatables";
import {Subject, Subscription} from "rxjs";
import {Api, Config} from "datatables.net";
import {AuthService} from "../../../../core/modules/auth";
import moment from "moment/moment";
import {LocalService} from "../../../../services/local.service";
import {OperationConstatationChargesService} from "../../../services/operation-constatation-charges.service";

@Component({
  selector: 'app-constatation-charges-list',
  templateUrl: './constatation-charges-list.component.html',
  styleUrl: './constatation-charges-list.component.scss'
})
export class ConstatationChargesListComponent implements OnInit, OnDestroy, AfterViewInit{

  form: FormGroup;

  currentOpcvm: any;
  currentSeance: any;
  currentUser: any;

  //DataTable Config
  datatableConfig: Config = {};
  dtOptions: any = {};
  dtTrigger: Subject<any> = new Subject();
  @ViewChild(DataTableDirective, {static: false}) datatableElement: DataTableDirective;

  downloading = false;
  downloaded = false;
  submitting = false;
  submitted = false;

  isLoading: boolean = false;
  subscriptions: Subscription[] = [];

  [key: string]: any;

  constructor(
    private fb: FormBuilder,
    private opConstaCharge: OperationConstatationChargesService,
    private localStore: LocalService,
    private authService: AuthService,
    ) {
    this.currentUser = this.authService.currentUserValue;
    this.currentOpcvm = this.localStore.getData("currentOpcvm");
    this.currentSeance = this.localStore.getData("currentSeance");
  }

  ngAfterViewInit(): void {
    this.dtTrigger.next(null);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sb => sb.unsubscribe());
  }

  ngOnInit(): void {
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
  }

  afficherListe(prefix: string) {
    const self = this;
    let columns: any[] = [
      {
        title: 'ID OP.', data: 'idOperation', render: function (data, type, row) {
          return row.idOperation;
        },
      },
      {
        title: 'DATE OP.', data: 'dateOperation', render: function (data, type, row) {
          return moment(data).format('DD MMM YYYY à HH:mm:ss');
        },
      },
      {
        title: 'CHARGE', data: '', render: function (data, type, row) {
          return 'A récupérer';
        },
      },
      {
        title: 'DATE SOLDE PREV.', data: 'dateSolde', render: function (data, type, row) {
          return moment(data).format('DD MMM YYYY à HH:mm:ss');
        },
      },
      {
        title: 'SOLDE PROVISIONNE', data: 'montant', render: function (data, type, row) {
          return row.montant?.toLocaleString('fr-FR', {minimumFractionDigits:6, maximumFractionDigits:6});
        },
      },
      {
        title: 'MONTANT REEL', data: 'montantCharge', render: function (data, type, row) {
          return row.montantCharge?.toLocaleString('fr-FR', {minimumFractionDigits:6, maximumFractionDigits:6}) || 0;
        },
      },
    ];
    this.datatableConfig = {
      processing: true,
      serverSide: true,
      ajax: (dataTablesParameters: any, callback) => {
        let idOpcvm = this.currentOpcvm?.idOpcvm;
        let idSeance = this.currentSeance?.idSeanceOpcvm?.idSeance;
        let param = {
          idOpcvm: idOpcvm,
          idSeance: idSeance,
          datatableParameters: dataTablesParameters
        };
        if (prefix.toLowerCase() === "l") {
          const sb = self.opConstaCharge.afficherListe(param)
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
      createdRow: function (row, data: any, dataIndex) {},
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
  }

  actualiser() {
    this.afficherListe("l");
  }
}
