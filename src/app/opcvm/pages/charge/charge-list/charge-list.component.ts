import {AfterViewInit, Component, EventEmitter, OnDestroy, OnInit, Renderer2} from '@angular/core';
import {Subscription} from "rxjs";
import {Config} from "datatables.net";
import {SweetAlertOptions} from "sweetalert2";
import {ActivatedRoute, Router} from "@angular/router";
import {ActionnairecommissionService} from "../../../services/actionnairecommission.service";
import {AuthService} from "../../../../core/modules/auth";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {
  DeleteActionnairecommissionModalComponent
} from "../../actionnairecommission/delete-actionnairecommission-modal/delete-actionnairecommission-modal.component";
import {ChargeService} from "../../../services/charge.service";
import {DeleteChargeModalComponent} from "../delete-charge-modal/delete-charge-modal.component";

@Component({
  selector: 'app-charge-list',
  templateUrl: './charge-list.component.html',
  styleUrl: './charge-list.component.scss'
})
export class ChargeListComponent implements OnInit, OnDestroy, AfterViewInit {
  isLoading: boolean;
  private subscriptions: Subscription[] = [];
  dateRecup:string[];
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
    public entityService: ChargeService,
    public authService: AuthService,
    private modalService: NgbModal) {
  }

  ngOnInit(): void {
    //console.log("currentOpcvm=",this.authService.LocalStorageManager.getValue("currentOpcvm"))
    //console.log("idOpcvm=",this.authService.LocalStorageManager.getValue("currentOpcvm")?.idOpcvm)
    this.datatableConfig = {
      serverSide: true,
      ajax: (dataTablesParameters: any, callback) => {
        console.log("PARAMS === ", dataTablesParameters);
        const sb = this.entityService.datatable_id(dataTablesParameters,this.authService.LocalStorageManager.getValue("currentOpcvm")?.idOpcvm)
          .subscribe(resp => {
            callback(resp.data);
          });
        this.subscriptions.push(sb);
      },
      columns: [
        {
          title: 'Code', data: 'codeCharge', render: function (data, type, row) {
            return row.codeCharge;
          }
        },
        {
          title: 'Désignation', data: 'designation', render: function (data, type, row) {
            return row.designation;
          }
        },
        {
          title: 'Type', data: 'typeCharge', render: function (data, type, row) {
            return row.typeCharge;
          }
        },
        {
          title: 'Montant', data: 'montant', render: function (data, type, row) {
            return row.montant;//moment(data).format('DD/MM/YYYY');
          }
        },
        {
          title: 'Modèle', data: 'libelleNatureOperation', render: function (data, type, row) {
            return row.natureOperation.libelleNatureOperation;//moment(data).format('DD/MM/YYYY');
          }
        },
        {
          title: 'Actif?', data: 'estActif', render: function (data, type, row) {
            //return row.standard;
            return `<div class="badge ${row.estActif ? 'badge-success' : 'badge-info'} fw-bold">${row.estActif ? 'Oui' : 'Non'}</div>`;
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
                    <a type="button" class="dropdown-item" data-action="view" data-id="${full.idCharge}">Afficher</a>
                </li>`;
        const edit = `
                <li>
                    <a type="button" class="dropdown-item" data-action="edit" data-id="${full.idCharge}"
                    >Modifier</a>
                </li>`;
        const separator = `<li><hr class="dropdown-divider"></li>`;
        const delete1 = `<li>
                    <a type="button" class="dropdown-item" data-action="delete" data-id="${full.idCharge}"
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
    const modalRef = this.modalService.open(DeleteChargeModalComponent);
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


