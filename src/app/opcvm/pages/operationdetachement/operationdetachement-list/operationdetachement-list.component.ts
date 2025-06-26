import {AfterViewInit, Component, EventEmitter, OnDestroy, OnInit, Renderer2} from '@angular/core';
import {Subscription} from "rxjs";
import {Config} from "datatables.net";
import {SweetAlertOptions} from "sweetalert2";
import {LocalService} from "../../../../services/local.service";
import {ActivatedRoute, Router} from "@angular/router";
import {ProfilcommissionsousrachService} from "../../../services/profilcommissionsousrach.service";
import {AuthService} from "../../../../core/modules/auth";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {
  DeleteProfilcommissionsousrachModalComponent
} from "../../profilcommissionsousrach/delete-profilcommissionsousrach-modal/delete-profilcommissionsousrach-modal.component";
import {OperationdetachementService} from "../../../services/operationdetachement.service";
import moment from "moment";
import {
  DeleteModalOperationdetachementComponent
} from "../delete-modal-operationdetachement/delete-modal-operationdetachement.component";

@Component({
  selector: 'app-operationdetachement-list',
  templateUrl: './operationdetachement-list.component.html',
  styleUrl: './operationdetachement-list.component.scss'
})
export class OperationdetachementListComponent implements OnInit, OnDestroy, AfterViewInit {
  isLoading: boolean;
  private subscriptions: Subscription[] = [];

  datatableConfig: Config = {};
  // Reload emitter inside datatable
  reloadEvent: EventEmitter<boolean> = new EventEmitter();

  swalOptions: SweetAlertOptions = {};

  private clickListener: () => void;
  private idInAction: number;

  constructor(
    private localStore: LocalService,
    private route: ActivatedRoute,
    private router: Router,
    private renderer: Renderer2,
    public entityService: OperationdetachementService,
    public authService: AuthService,
    private modalService: NgbModal) {
  }

  ngOnInit(): void {

    this.datatableConfig = {
      serverSide: true,
      ajax: (dataTablesParameters: any, callback) => {
        console.log("PARAMS === ", dataTablesParameters);
        const sb = this.entityService.datatable_id(dataTablesParameters,this.localStore.getData("currentOpcvm")?.idOpcvm)
          .subscribe(resp => {
            callback(resp.data);
            console.log(resp.data)
          });
        this.subscriptions.push(sb);
      },
      columns: [
        {
          title: 'Titre', data: 'symbolTitre', render: function (data, type, row) {
            return row.symboleTitre;
          }
        },
        {
          title: 'Intervenant', data: 'intervenant', render: function (data, type, row) {
            return row.intervenant;
          }
        },
        {
          title: 'Date OP.', data: 'dateOperation', render: function (data, type, row) {
            return moment(row.dateOperation).format('DD/MM/YYYY');
          }
        },
        {
          title: 'Montant', data: 'montant', render: function (data, type, row) {
            return row.montant;
          }
        },
        {
          title: 'Libellé', data: 'libelleOperation', render: function (data, type, row) {
            return row.libelleOperation;
          }
        },
        {
          title: 'Type evenement', data: 'typeEvenement', render: function (data, type, row) {
            return row.typeEvenement;
          }
        },
        {
          title: 'Type paiement', data: 'typePayement', render: function (data, type, row) {
            return row.typePayement;
          }
        },
        {
          title: 'Qte détenue', data: 'qteDetenue', render: function (data, type, row) {
            return row.qteDetenue;
          }
        },
        {
          title: 'Coupon Unit.', data: 'couponDividendeUnitaire', render: function (data, type, row) {
            return row.couponDividendeUnitaire;
          }
        },
        {
          title: 'MT. brut', data: 'montantBrut', render: function (data, type, row) {
            return row.montantBrut;
          }
        },
        {
          title: 'Quantité amortie', data: 'quantiteAmortie', render: function (data, type, row) {
            return row.quantiteAmortie;
          }
        },
        {
          title: 'Nominal remb.', data: 'nominalRemb', render: function (data, type, row) {
            return row.nominalRemb;
          }
        },
        {
          title: 'Capital remb.', data: 'capitalRembourse', render: function (data, type, row) {
            return row.capitalRembourse;
          }
        },
        {
          title: 'MT. net', data: 'montantTotalARecevoir', render: function (data, type, row) {
            return row.montantTotalARecevoir;
          }
        },
        {
          title: 'Est payé', data: 'estPaye', render: function (data, type, row) {
            //return row.standard;
            return `<div class="badge ${row.estPaye ? 'badge-success' : 'badge-info'} fw-bold">${row.estPaye ? 'Oui' : 'Non'}</div>`;
          }
        },
      ],
      createdRow: function (row, data, dataIndex) {
        // $('td:eq(0)', row).addClass('d-flex align-items-center');
      },
    };
  }

  ngOnDestroy(): void {
    if (this.clickListener) {
      this.clickListener();
    }
    this.subscriptions.forEach((sb) => sb.unsubscribe());
  }

  renderActionColumn(): void {
    if (this.datatableConfig.columns) {
      let actions = this.datatableConfig.columns[this.datatableConfig.columns?.length-1];
      actions.render = (data: any, type: any, full: any) => {
        const parentActionStart = `
                <div class="btn-group">
                    <button type="button" class="btn btn-sm btn-primary dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
                      Action
                    </button>
                    <ul class="dropdown-menu">`;
        const show = `
                <li>
                    <a type="button" class="dropdown-item" data-action="view" data-id="${full.idOperation}">Afficher</a>
                </li>`;
        const edit = `
                <li>
                    <a type="button" class="dropdown-item" data-action="edit" data-id="${full.idOperation}">Modifier</a>
                </li>`;
        const separator = `<li><hr class="dropdown-divider"></li>`;
        const delete1 = `<li>
                    <a type="button" class="dropdown-item" data-action="delete" data-id="${full.idOperation}"
                    >Supprimer</a>
                </li>`;
        const parentActionEnd = `</ul>
            </div>`;
        const actions = [];
        actions.push(parentActionStart);
        // actions.push(show);
        actions.push(edit);
        actions.push(separator);
        actions.push(delete1);
        actions.push(parentActionEnd);

        return actions.join('');
      }
    }
  }

  supprimer(id: string) {
    const modalRef = this.modalService.open(DeleteModalOperationdetachementComponent);
    modalRef.componentInstance.id = id;
    // modalRef.result.then(() => this.entityService.fetch(), () => {});
  }

  ngAfterViewInit(): void {
    this.renderActionColumn();
    this.clickListener = this.renderer.listen(document, 'click', (event) => {
      const closestBtn = event.target.closest('.btn, .dropdown-item');
      if (closestBtn) {
        const {action, id} = closestBtn.dataset;
        this.idInAction = id;
        // let id3=id+"/"+id2;
        switch (action) {
          case 'view':
            this.router.navigate(['show', id], {relativeTo: this.route});
            break;

          case 'create':
            this.router.navigate(['new'], {relativeTo: this.route});
            break;

          case 'edit':
            this.router.navigate(['edit', id], {relativeTo: this.route});
            break;

          case 'delete':
            this.supprimer(id);
            break;
        }
      }
    });
  }
}
