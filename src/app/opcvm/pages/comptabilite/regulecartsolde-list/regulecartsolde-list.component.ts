import {AfterViewInit, Component, EventEmitter, OnDestroy, OnInit, Renderer2} from '@angular/core';
import {Subscription} from "rxjs";
import {Config} from "datatables.net";
import {SweetAlertOptions} from "sweetalert2";
import {LocalService} from "../../../../services/local.service";
import {ActivatedRoute, Router} from "@angular/router";
import {ActionnaireopcvmService} from "../../../services/actionnaireopcvm.service";
import {AuthService} from "../../../../core/modules/auth";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {
  DeleteActionnaireopcvmModalComponent
} from "../../actionnaireopcvm/delete-actionnaireopcvm-modal/delete-actionnaireopcvm-modal.component";
import {OperationregulecartsoldeService} from "../../../services/operationregulecartsolde.service";
import {
  DeleteModalRegulecartsoldeComponent
} from "../delete-modal-regulecartsolde/delete-modal-regulecartsolde.component";
import moment from "moment";

@Component({
  selector: 'app-regulecartsolde-list',
  templateUrl: './regulecartsolde-list.component.html',
  styleUrl: './regulecartsolde-list.component.scss'
})
export class RegulecartsoldeListComponent implements OnInit, OnDestroy, AfterViewInit {
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
    public entityService: OperationregulecartsoldeService,
    public authService: AuthService,
    private modalService: NgbModal) {
  }

  ngOnInit(): void {
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
        const sb = this.entityService.afficherListe(param)
          .subscribe(resp => {
            callback(resp.data);
          });
        this.subscriptions.push(sb);
      },
      columns: [
        {
          title: 'Id opération', data: 'idOperation', render: function (data, type, row) {
            return row.idOperation;
          }
        },
        {
          title: 'Date opération', data: 'dateOperation', render: function (data, type, row) {
            return moment(row.dateOperation).format('DD/MM/YYYY');
          }
        },
        {
          title: 'Montant regul', data: 'montant', render: function (data, type, row) {
            return row.montant;
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
                    <a type="button" class="dropdown-item" data-action="edit" data-id="${full.idOperation}"
                    >Modifier</a>
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
    const modalRef = this.modalService.open(DeleteModalRegulecartsoldeComponent);
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

