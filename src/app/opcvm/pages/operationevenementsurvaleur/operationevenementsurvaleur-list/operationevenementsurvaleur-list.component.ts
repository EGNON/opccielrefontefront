import {AfterViewInit, Component, EventEmitter, OnDestroy, OnInit, Renderer2} from '@angular/core';
import {Subscription} from "rxjs";
import {Config} from "datatables.net";
import {SweetAlertOptions} from "sweetalert2";
import {LocalService} from "../../../../services/local.service";
import {ActivatedRoute, Router} from "@angular/router";
import {OperationdetachementService} from "../../../services/operationdetachement.service";
import {AuthService} from "../../../../core/modules/auth";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import moment from "moment/moment";
import {
  DeleteModalOperationdetachementComponent
} from "../../operationdetachement/delete-modal-operationdetachement/delete-modal-operationdetachement.component";
import {
  DeleteModalOperationevenementsurvaleurComponent
} from "../delete-modal-operationevenementsurvaleur/delete-modal-operationevenementsurvaleur.component";
import {OperationevenementsurvaleurService} from "../../../services/operationevenementsurvaleur.service";

@Component({
    selector: 'app-operationevenementsurvaleur-list',
    templateUrl: './operationevenementsurvaleur-list.component.html',
    styleUrl: './operationevenementsurvaleur-list.component.scss',
    standalone: false
})
export class OperationevenementsurvaleurListComponent implements OnInit, OnDestroy, AfterViewInit {
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
    public entityService: OperationevenementsurvaleurService,
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
          title: 'Id Avis', data: 'idOperation', render: function (data, type, row) {
            return row.idOperation;
          }
        },
        {
          title: 'Date OP.', data: 'dateOperation', render: function (data, type, row) {
            return moment(row.dateOperation).format('DD/MM/YYYY');
          }
        },
        {
          title: 'Titre', data: 'symboleTitre', render: function (data, type, row) {
            return row.designationTitre;
          }
        },
        {
          title: 'Valeur formule', data: 'valeurFormule', render: function (data, type, row) {
            return '';//row.valeurFormule;
          }
        },
        {
          title: 'Valeur code analytique', data: 'valeurCodeAnalytique', render: function (data, type, row) {
            return '';// row.valeurCodeAnalytique;
          }
        }
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
    const modalRef = this.modalService.open(DeleteModalOperationevenementsurvaleurComponent);
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
