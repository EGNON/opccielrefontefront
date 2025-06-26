import {AfterViewInit, Component, EventEmitter, OnDestroy, OnInit, Renderer2, ViewChild} from '@angular/core';
import {Subject, Subscription} from "rxjs";
import {Api, Config} from "datatables.net";
import {SweetAlertOptions} from "sweetalert2";
import {LocalService} from "../../../../services/local.service";
import {ActivatedRoute, Router} from "@angular/router";
import {OperationregulecartsoldeService} from "../../../services/operationregulecartsolde.service";
import {AuthService} from "../../../../core/modules/auth";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import moment from "moment/moment";
import {
  DeleteModalRegulecartsoldeComponent
} from "../delete-modal-regulecartsolde/delete-modal-regulecartsolde.component";
import {OperationService} from "../../../services/operation.service";
import {DataTableDirective} from "angular-datatables";

@Component({
  selector: 'app-paiement-commission-investissement-list',
  templateUrl: './paiement-commission-investissement-list.component.html',
  styleUrl: './paiement-commission-investissement-list.component.scss'
})
export class PaiementCommissionInvestissementListComponent implements OnInit, OnDestroy, AfterViewInit {
  isLoading: boolean;
  private subscriptions: Subscription[] = [];

  datatableConfig: Config = {};
  // Reload emitter inside datatable
  reloadEvent: EventEmitter<boolean> = new EventEmitter();
  dtTrigger: Subject<any> = new Subject();
  dtOptions: any = {};
  swalOptions: SweetAlertOptions = {};
  @ViewChild(DataTableDirective, {static: false}) datatableElement: DataTableDirective;

  private clickListener: () => void;
  private idInAction: number;

  constructor(
    private localStore: LocalService,
    private route: ActivatedRoute,
    private router: Router,
    private renderer: Renderer2,
    public entityService: OperationService,
    public authService: AuthService,
    private modalService: NgbModal) {
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
    // console.log("currentOpcvm=",this.localStore.getData("currentOpcvm"))
    // console.log("idOpcvm=",this.localStore.getData("currentOpcvm")?.idOpcvm)
    this.datatableConfig = {
      serverSide: true,
      ajax: (dataTablesParameters: any, callback) => {
        console.log("PARAMS === ", dataTablesParameters);
        let idOpcvm = this.localStore.getData("currentOpcvm")?.idOpcvm;
        let param = {
          idOpcvm: idOpcvm,
          idSeance: 0,
          datatableParameters: dataTablesParameters
        };
        const sb = this.entityService.afficherComSurInvestissement(param)
          .subscribe(resp => {
            callback(resp.data);
          });
        this.subscriptions.push(sb);
      },
      columns: [
        {
          title: 'Date opération', data: 'dateOperation', render: function (data, type, row) {
            return moment(row.dateOperation).format('DD/MM/YYYY');
          }
        },
        {
          title: 'LIBELLE', data: 'libelleOperation', render: function (data, type, row) {
            return row.libelleOperation;
          }
        },
        {
          title: 'Montant', data: 'montant', render: function (data, type, row) {
            return row.montant;
          }
        },
      ],
      createdRow: function (row, data, dataIndex) {
        // $('td:eq(0)', row).addClass('d-flex align-items-center');
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
  }
  ngOnDestroy(): void {
    if (this.clickListener) {
      this.clickListener();
    }
    this.subscriptions.forEach((sb) => sb.unsubscribe());
  }

  renderActionColumn(): void {
    // if (this.datatableConfig.columns) {
    //   let actions = this.datatableConfig.columns[this.datatableConfig.columns?.length-1];
    //   actions.render = (data: any, type: any, full: any) => {
    //     const parentActionStart = `
    //             <div class="btn-group">
    //                 <button type="button" class="btn btn-sm btn-primary dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
    //                   Action
    //                 </button>
    //                 <ul class="dropdown-menu">`;
    //     const show = `
    //             <li>
    //                 <a type="button" class="dropdown-item" data-action="view" data-id="${full.idOperation}">Afficher</a>
    //             </li>`;
    //     const edit = `
    //             <li>
    //                 <a type="button" class="dropdown-item" data-action="edit" data-id="${full.idOperation}"
    //                 >Modifier</a>
    //             </li>`;
    //     const separator = `<li><hr class="dropdown-divider"></li>`;
    //     const delete1 = `<li>
    //                 <a type="button" class="dropdown-item" data-action="delete" data-id="${full.idOperation}"
    //                 >Supprimer</a>
    //             </li>`;
    //     const parentActionEnd = `</ul>
    //         </div>`;
    //     const actions = [];
    //     actions.push(parentActionStart);
    //     // actions.push(show);
    //     actions.push(edit);
    //     actions.push(separator);
    //     actions.push(delete1);
    //     actions.push(parentActionEnd);
    //
    //     return actions.join('');
    //   }
    // }
  }

  supprimer(id: string) {
    const modalRef = this.modalService.open(DeleteModalRegulecartsoldeComponent);
    modalRef.componentInstance.id = id;
    // modalRef.result.then(() => this.entityService.fetch(), () => {});
  }
  ngAfterViewInit(): void {
    this.dtTrigger.next(null);
  }
}

