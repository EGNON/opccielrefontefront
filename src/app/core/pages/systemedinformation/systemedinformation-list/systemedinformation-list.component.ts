import {AfterViewInit, Component, EventEmitter, OnDestroy, OnInit, Renderer2} from '@angular/core';
import {Subscription} from "rxjs";
import {SweetAlertOptions} from "sweetalert2";
import {ActivatedRoute, Router} from "@angular/router";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {SystemedinformationService} from "../../../../crm/services/systemedinformation.service";
import moment from "moment";
import {
  DeleteSystemedinformationModalComponent
} from "../delete-systemedinformation-modal/delete-systemedinformation-modal.component";
import {Config} from "datatables.net";

@Component({
    selector: 'app-systemedinformation-list',
    templateUrl: './systemedinformation-list.component.html',
    styleUrl: './systemedinformation-list.component.scss',
    standalone: false
})
export class SystemedinformationListComponent implements OnInit, OnDestroy, AfterViewInit {
  isLoading: boolean;
  private subscriptions: Subscription[] = [];
  public buttonVisible:boolean;
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
    public entityService: SystemedinformationService,
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
          title: 'Logiciel', data: 'logiciel', render: function (data, type, row) {
            return row.logiciel;
          }
        },
        {
          title: 'Date acquisition', data: 'dateAcquisition', render: function (data, type, row) {
            return moment(row.dateAcquisition).format('DD/MM/yyyy');
          }
        },
        {
          title: 'Date Info AMF', data: 'dateInfoCREPMF', render: function (data, type, row) {
            return moment(row.dateInfoCREPMF).format('DD/MM/yyyy');
          }
        },
        {
          title: 'denomination', data: 'denomination', render: function (data, type, row) {
            return row.denomination;
          }
        },
        {
          title: 'Date Début maintenance', data: 'dateDebutMaintenance', render: function (data, type, row) {
            return moment(row.dateDebutMaintenance).format('DD/MM/yyyy');
          }
        },
        {
          title: 'Date fin maintenance', data: 'dateFinMaintenance', render: function (data, type, row) {
            return moment(row.dateFinMaintenance).format('DD/MM/yyyy');
          }
        },
        {
          title: 'Principales fonctionnalités', data: 'principalFonctionnalite', render: function (data, type, row) {
            return row.principalFonctionnalite;
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
                    <a type="button" class="dropdown-item" data-action="view" data-id="${full.idSystemeDinformation}">Afficher</a>
                </li>`;
        const edit = `
                <li>
                    <a type="button" class="dropdown-item" data-action="edit" data-id="${full.idSystemeDinformation}">Modifier</a>
                </li>`;
        const separator = `<li><hr class="dropdown-divider"></li>`;
        const delete1 = `<li>
                    <a type="button" class="dropdown-item" data-action="delete" data-id="${full.idSystemeDinformation}">Supprimer</a>
                </li>`;
        const parentActionEnd = `</ul>
            </div>`;
        console.log("full",full.idSystemeDinformation)
        if(full.idSystemeDinformation)
          this.buttonVisible=true;
        else
          this.buttonVisible=false
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

  supprimer(id: any) {
    const modalRef = this.modalService.open(DeleteSystemedinformationModalComponent);
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
