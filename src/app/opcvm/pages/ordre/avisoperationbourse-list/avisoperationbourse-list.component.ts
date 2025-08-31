import {AfterViewInit, Component, EventEmitter, OnDestroy, OnInit, Renderer2} from '@angular/core';
import {Subscription} from "rxjs";
import {Config} from "datatables.net";
import {SweetAlertOptions} from "sweetalert2";
import {LocalService} from "../../../../services/local.service";
import {ActivatedRoute, Router} from "@angular/router";
import {OrdreService} from "../../../services/ordre.service";
import {AuthService} from "../../../../core/modules/auth";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import moment from "moment";
import {DeleteChargeModalComponent} from "../../charge/delete-charge-modal/delete-charge-modal.component";
import {AvisoperationbourseService} from "../../../services/avisoperationbourse.service";
import {TitreModel} from "../../../../titresciel/models/titre.model";
import {Opcvm} from "../../../../core/models/opcvm";

@Component({
    selector: 'app-avisoperationbourse-list',
    templateUrl: './avisoperationbourse-list.component.html',
    styleUrl: './avisoperationbourse-list.component.scss',
    standalone: false
})
export class AvisoperationbourseListComponent implements OnInit, OnDestroy, AfterViewInit {
  isLoading: boolean;
  id?:any;
  private subscriptions: Subscription[] = [];
  dateRecup:string[];
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
    public entityService: AvisoperationbourseService,
    public authService: AuthService,
    private modalService: NgbModal) {
  }

  ngOnInit(): void {
    //console.log("currentOpcvm=",this.localStore.getData("currentOpcvm"))
    //console.log("idOpcvm=",this.localStore.getData("currentOpcvm")?.idOpcvm)
    this.id = this.route.snapshot.params['id'];
    this.datatableConfig = {
      serverSide: true,
      ajax: (dataTablesParameters: any, callback) => {
        console.log("PARAMS === ", dataTablesParameters);
        const sb = this.entityService.afficherListeAvis(dataTablesParameters,
          this.localStore.getData("currentOpcvm")?.idOpcvm,this.id)
          .subscribe(resp => {
            callback(resp.data);
          });
        this.subscriptions.push(sb);
      },
      columns: [
        {
          title: 'ID OP.', data: 'idOperation', render: function (data, type, row) {
            return row.idAvis;
          }
        },
        {
          title: 'Date', data: 'dateOperation', render: function (data, type, row) {
            return moment(row.dateOperation).format("DD/MM/YYYY");
          }
        },
        {
          title: 'Référence', data: 'refenrenceAvis', render: function (data, type, row) {
            return row.referenceAvis;
          }
        },
        {
          title: 'Quantité', data: 'quantiteLimite', render: function (data, type, row) {
            return row.quantiteLimite;
          }
        },
        {
          title: 'Cours', data: 'coursLimite', render: function (data, type, row) {
            return row.coursLimite;
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
        // const create = `
        //         <li>
        //             <a type="button" class="dropdown-item" data-action="create"
        //             data-id="${full.idOrdre}">Nouveau</a>
        //         </li>`;
        const edit = `
                <li>
                    <a type="button" class="dropdown-item" data-action="edit" data-id3="${full.idAvis}"
                    >Modifier</a>
                </li>`;
        const separator = `<li><hr class="dropdown-divider"></li>`;
        const delete1 = `<li>
                    <a type="button" class="dropdown-item" data-action="delete" data-id3="${full.idAvis}"
                    >Supprimer</a>
                </li>`;
        const parentActionEnd = `</ul>
            </div>`;
        const actions = [];
        actions.push(parentActionStart);
        // actions.push(create);
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
        const {action, id3} = closestBtn.dataset;
        this.idInAction = id3;
        // console.log(action,id)
        switch (action) {
          case 'view':
            this.router.navigate(['show', id3], {relativeTo: this.route});
            break;

          case 'create':
            this.router.navigate(['new'], {relativeTo: this.route});
            break;

          case 'edit':
            this.router.navigate(['edit', id3], {relativeTo: this.route});
            break;

          case 'delete':
            this.supprimer(id3);
            break;
        }
      }
    });
  }
}
