import {AfterViewInit, Component, EventEmitter, OnDestroy, OnInit, Renderer2} from '@angular/core';
import {Subscription} from "rxjs";
import {Config} from "datatables.net";
import {SweetAlertOptions} from "sweetalert2";
import {ActivatedRoute, Router} from "@angular/router";
import {CritereAlerteService} from "../../../../lab/services/criterealerte.service";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import moment from "moment/moment";
import {
  DeleteCriterealerteModalComponent
} from "../../../../lab/pages/criterealerte/delete-criterealerte-modal/delete-criterealerte-modal.component";
import {ActionnaireopcvmService} from "../../../services/actionnaireopcvm.service";
import {AuthService} from "../../../../core/modules/auth";
import {
  DeleteActionnaireopcvmModalComponent
} from "../delete-actionnaireopcvm-modal/delete-actionnaireopcvm-modal.component";

@Component({
  selector: 'app-actionnaireopcvm-list',
  templateUrl: './actionnaireopcvm-list.component.html',
  styleUrl: './actionnaireopcvm-list.component.scss'
})
export class ActionnaireopcvmListComponent implements OnInit, OnDestroy, AfterViewInit {
  isLoading: boolean;
  private subscriptions: Subscription[] = [];

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
    public entityService: ActionnaireopcvmService,
    public authService: AuthService,
    private modalService: NgbModal) {
  }

  ngOnInit(): void {
    console.log("currentOpcvm=",this.authService.LocalStorageManager.getValue("currentOpcvm"))
    console.log("idOpcvm=",this.authService.LocalStorageManager.getValue("currentOpcvm")?.idOpcvm)
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
          title: 'Dénomination', data: 'denomination', render: function (data, type, row) {
            return row.personne.denomination;
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
                    <a type="button" class="dropdown-item" data-action="view" data-id="${full.idCritereAlerte}">Afficher</a>
                </li>`;
        const edit = `
                <li>
                    <a type="button" class="dropdown-item" data-action="edit" data-id="${full.personne.idPersonne}"
                    data-id2="${full.opcvm.idOpcvm}">Modifier</a>
                </li>`;
        const separator = `<li><hr class="dropdown-divider"></li>`;
        const delete1 = `<li>
                    <a type="button" class="dropdown-item" data-action="delete" data-id="${full.personne.idPersonne}"
                    data-id2="${full.opcvm.idOpcvm}">Supprimer</a>
                </li>`;
        const parentActionEnd = `</ul>
            </div>`;
        const actions = [];
        actions.push(parentActionStart);
        // actions.push(show);
        // actions.push(edit);
        actions.push(separator);
        actions.push(delete1);
        actions.push(parentActionEnd);

        return actions.join('');
      }
    }
  }

  supprimer(id: string) {
    const modalRef = this.modalService.open(DeleteActionnaireopcvmModalComponent);
    modalRef.componentInstance.id = id;
    // modalRef.result.then(() => this.entityService.fetch(), () => {});
  }

  ngAfterViewInit(): void {
    this.renderActionColumn();
    this.clickListener = this.renderer.listen(document, 'click', (event) => {
      const closestBtn = event.target.closest('.btn, .dropdown-item');
      if (closestBtn) {
        const {action, id,id2} = closestBtn.dataset;
        this.idInAction = id;
        let id3=id+"/"+id2;

        switch (action) {
          case 'view':
            this.router.navigate(['show', id], {relativeTo: this.route});
            break;

          case 'create':
            this.router.navigate(['new'], {relativeTo: this.route});
            break;

          case 'edit':
            this.router.navigate(['edit', id,id2], {relativeTo: this.route});
            break;

          case 'delete':
            this.supprimer(id3);
            break;
        }
      }
    });
  }
}

