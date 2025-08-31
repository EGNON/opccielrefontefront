import {AfterViewInit, Component, EventEmitter, OnDestroy, OnInit, Renderer2} from '@angular/core';
import {Subscription} from "rxjs";
import {CleComptecomptable} from "../../../models/clecomptecomptable.model";
import {SweetAlertOptions} from "sweetalert2";
import {ActivatedRoute, Router} from "@angular/router";
import {ModeleecriturenatureoperationService} from "../../../services/modeleecriturenatureoperation.service";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {
  DeleteModeleecritureModalComponent
} from "../../modeleecriture/delete-modeleecriture-modal/delete-modeleecriture-modal.component";
import {ComptecomptableService} from "../../../services/comptecomptable.service";
import {
  DeleteComptecomptableModalComponent
} from "../delete-comptecomptable-modal/delete-comptecomptable-modal.component";
import {Config} from "datatables.net";

@Component({
    selector: 'app-comptecomptable-list',
    templateUrl: './comptecomptable-list.component.html',
    styleUrl: './comptecomptable-list.component.scss',
    standalone: false
})
export class ComptecomptableListComponent implements OnInit, OnDestroy, AfterViewInit {
  isLoading: boolean;
  private subscriptions: Subscription[] = [];
  idCompteComptable:CleComptecomptable;
  datatableConfig: Config = {};
  // Reload emitter inside datatable
  reloadEvent: EventEmitter<boolean> = new EventEmitter();

  swalOptions: SweetAlertOptions = {};

  private clickListener: () => void;
  private idInAction: number;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private renderer: Renderer2,
    public entityService: ComptecomptableService,
    private modalService: NgbModal) {
  }

  ngOnInit(): void {
    this.datatableConfig = {
      serverSide: true,
      ajax: (dataTablesParameters: any, callback) => {
        console.log("PARAMS === ", dataTablesParameters);
        const sb = this.entityService.datatable(dataTablesParameters)
          .subscribe(resp => {
            callback(resp.data);
          });
        this.subscriptions.push(sb);
      },
      columns: [
        {
          title: 'N°Compte', data: 'numCompteComptable', render: function (data, type, row) {
            return row.numCompteComptable;
          }
        },
        {
          title: 'Libellé', data: 'libelleCompteComptable', render: function (data, type, row) {
            return row.libelleCompteComptable;
          }
        },
        {
          title: 'Mouvement', data: 'sensMvt', render: function (data, type, row) {
            return row.sensMvt;
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

  renderOperationColumn(): void {
    if (this.datatableConfig.columns) {
      let Operations = this.datatableConfig.columns[this.datatableConfig.columns?.length-1];
      Operations.render = (data: any, type: any, full: any) => {
        const parentOperationStart = `
                <div class="btn-group">
                    <button type="button" class="btn btn-sm btn-primary dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
                      Action
                    </button>
                    <ul class="dropdown-menu">`;

        const show = `
                <li>
                    <a type="button" class="dropdown-item" data-action="view" data-id="${full.numCompteComptable}">Afficher</a>
                </li>`;
        const edit = `
                <li>
                    <a type="button" class="dropdown-item" data-action="edit" data-id="${full.numCompteComptable}">Modifier</a>
                </li>`;
        const separator = `<li><hr class="dropdown-divider"></li>`;
        const delete1 = `<li>
                    <a type="button" class="dropdown-item" data-action="delete" data-id="${full.numCompteComptable}"
                    data-id2="${full.plan.codePlan}">Supprimer</a>
                </li>`;
        const parentOperationEnd = `</ul>
            </div>`;
        const actions = [];
        actions.push(parentOperationStart);
        // Operations.push(show);
        actions.push(edit);
        actions.push(separator);
        actions.push(delete1);
        actions.push(parentOperationEnd);

        return actions.join('');
      }
    }
  }

  supprimer(id: any) {
    const modalRef = this.modalService.open(DeleteComptecomptableModalComponent);
    modalRef.componentInstance.id = id;

    // modalRef.result.then(() => this.entityService.fetch(), () => {});
  }

  ngAfterViewInit(): void {
    this.renderOperationColumn();
    this.clickListener = this.renderer.listen(document, 'click', (event) => {
      const closestBtn = event.target.closest('.btn, .dropdown-item');
      if (closestBtn) {
        const {action, id,id2} = closestBtn.dataset;
        let id4=id+"/"+id2
        this.idInAction = id;
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
            this.supprimer(id4);
            break;
        }
      }
    });
  }
}

