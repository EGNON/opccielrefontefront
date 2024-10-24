import {AfterViewInit, Component, EventEmitter, OnDestroy, OnInit, Renderer2} from '@angular/core';
import {Config} from "datatables.net";
import {filter, map} from "rxjs/operators";
import moment from "moment";
import {DepotsouscriptionService} from "../../../services/depotsouscription.service";
import {Subscription} from "rxjs";
import {SweetAlertOptions} from "sweetalert2";
import {ActivatedRoute, Router} from "@angular/router";
import {
  DeleteCompterenduModalComponent
} from "../../../../crm/pages/compterendu/delete-compterendu-modal/delete-compterendu-modal.component";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: 'app-depotsouscription-list',
  templateUrl: './depotsouscription-list.component.html',
  styleUrl: './depotsouscription-list.component.scss'
})
export class DepotsouscriptionListComponent implements OnInit, OnDestroy, AfterViewInit{

  private subscriptions: Subscription[] = [];
  datatableConfig: Config = {};

  // Reload emitter inside datatable
  reloadEvent: EventEmitter<boolean> = new EventEmitter();
  swalOptions: SweetAlertOptions = {};

  private clickListener: () => void;
  private idInAction: number;

  constructor(
    private entityService: DepotsouscriptionService,
    private renderer: Renderer2,
    private router: Router,
    private route: ActivatedRoute,
    private modalService: NgbModal
  ) {
  }

  ngAfterViewInit(): void {
    this.renderActionColumn();
    this.clickListener = this.renderer.listen(document, 'click', (event) => {
      const closestBtn = event.target.closest('.btn, .dropdown-item');
      if (closestBtn) {
        const { action, id } = closestBtn.dataset;
        this.idInAction = id;
        switch (action) {
          case 'view':
            this.router.navigate(['view', id], {relativeTo: this.route});
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

  ngOnDestroy(): void {
    if (this.clickListener) {
      this.clickListener();
    }
    this.subscriptions.forEach((sb) => sb.unsubscribe());
  }

  ngOnInit(): void {
    this.datatableConfig = {
      serverSide: true,
      ajax: (dataTablesParameters: any, callback) => {
        const sb = this.entityService.afficherListeDepot(dataTablesParameters)
          .subscribe(resp => {
            console.log("Retour === ", resp);
            callback(resp.data);
          });
        this.subscriptions.push(sb);
      },
      columns: [
        {
          title: 'TYPE', data: 'type', render: function (data, type, row) {
            return row.type;
          },
        },
        {
          title: 'N° OP.', data: 'idOperation', render: function (data, type, row) {
            return row.idOperation;
          }
        },
        {
          title: 'DATE OP.', data: 'dateOperation', render: function (data, type, row) {
            return moment(data).format('DD MMM YYYY, hh:mm a');
          }
        },
        {
          title: 'DATE VALEUR', data: 'dateValeur', render: function (data) {
            return moment(data).format('DD MMM YYYY, hh:mm a');
          }
        },
        {
          title: 'LIBELLE OP.', data: 'libelleOperation', render: function (data, type, full) {
            return full.libelleOperation;
          }
        },
        {
          title: 'QUANTITE', data: 'quantite', render: function (data, type, full) {
            return full.quantite;
          }
        },
        {
          title: 'MONTANT', data: 'montant', render: function (data, type, full) {
            return full.montant;
          }
        },
      ],
      createdRow: function (row, data, dataIndex) {
        $('td:eq(0)', row).addClass('d-flex align-items-center');
      },
    };
  }

  supprimer(id: number) {
    const modalRef = this.modalService.open(DeleteCompterenduModalComponent);
    modalRef.componentInstance.id = id;
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
                    <a type="button" class="dropdown-item" data-action="delete" data-id="${full.idOperation}">Supprimer</a>
                </li>`;
        const parentActionEnd = `</ul>
            </div>`;
        const actions = [];
        actions.push(parentActionStart);
        actions.push(show);
        if(!full.estValide) actions.push(edit);
        if(!full.estValide) actions.push(separator);
        if(!full.estValide) actions.push(delete1);
        actions.push(parentActionEnd);

        return actions.join('');
      }
    }
  }
}
