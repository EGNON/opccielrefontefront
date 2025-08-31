import {AfterViewInit, Component, EventEmitter, OnDestroy, OnInit, Renderer2, ViewChild} from '@angular/core';
import {Subscription} from "rxjs";
import {SwalComponent} from "@sweetalert2/ngx-sweetalert2";
import {SocieteDeGestionService} from "../../../../crm/services/societedegestion.service";
import {ActivatedRoute, NavigationExtras, Router} from "@angular/router";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {
  DeletePersonneMoraleModalComponent
} from "../../personne-morale/delete-personne-morale-modal/delete-personne-morale-modal.component";
import {SweetAlertOptions} from "sweetalert2";
import {Config} from "datatables.net";

@Component({
    selector: 'app-societedegestion-list',
    templateUrl: './societedegestion-list.component.html',
    styleUrl: './societedegestion-list.component.scss',
    standalone: false
})
export class SocietedegestionListComponent implements OnInit, OnDestroy, AfterViewInit{

  newButtonTitle: string = "Nouveau";
  personnes: any;
  title: string;
  isLoading: boolean;
  private subscriptions: Subscription[] = [];

  datatableConfig: Config = {};

  @ViewChild('noticeSwal')
  noticeSwal!: SwalComponent;
  swalOptions: SweetAlertOptions = {};

  // Reload emitter inside datatable
  reloadEvent: EventEmitter<boolean> = new EventEmitter();

  private clickListener: () => void;
  private idInAction: number;

  constructor(
    private renderer: Renderer2,
    public entityService:SocieteDeGestionService,
    private route: ActivatedRoute,
    private router: Router,
    private modalService: NgbModal) {
    // this.router.routeReuseStrategy.shouldReuseRoute = () => false;
  }
  ngOnInit() {
    this.datatableConfig = {
      serverSide: true,
      ajax: (dataTablesParameters: any, callback) => {
        const sb = this.entityService.getSocieteDeGestion(dataTablesParameters)
          .subscribe(resp => {
            console.log(resp)
            callback(resp);
          });
        this.subscriptions.push(sb);
      },
      columns: [
        {
          title: 'SIGLE', data: 'sigle', render: function (data, type, row) {
            return row.sigle || '';
          },
          orderData: [1],
          orderSequence: ['asc', 'desc'],
          type: 'string',
        },
        {
          title: 'RAISON SOCIALE', data: 'raisonSociale', render: function (data, type, row) {
            return row.raisonSociale || '';
          },
          orderData: [1],
          orderSequence: ['asc', 'desc'],
          type: 'string',
        },
        {
          title: 'SITE WEB', data: 'siteWeb', render: function (data, type, row) {
            return row.siteWeb || '';
          },
          orderData: [1],
          orderSequence: ['asc', 'desc'],
          type: 'string',
        }
      ],
      createdRow: function (row, data, dataIndex) {
        $('td:eq(0)', row).addClass('d-flex align-items-center');
        // $('td:last-child', row).addClass('d-flex flex-row align-middle');
      },
    };
    // this.datatableConfig = {
    //   serverSide: true,
    //   ajax: (dataTablesParameters: any, callback) => {
    //     const sb=this.entityService.getSocieteDeGestion(dataTablesParameters)
    //       .subscribe(resp => {
    //         callback(resp);
    //       });
    //     this.subscriptions.push(sb);
    //   },
    //   columns: [
    //     {
    //       title: 'SIGLE', data: 'sigle', render: function (data, type, row) {
    //         return row.sigle || '';
    //       },
    //       orderData: [1],
    //       orderSequence: ['asc', 'desc'],
    //       type: 'string',
    //     },
    //     {
    //       title: 'RAISON SOCIALE', data: 'raisonSociale', render: function (data, type, row) {
    //         return row.raisonSociale || '';
    //       },
    //       orderData: [1],
    //       orderSequence: ['asc', 'desc'],
    //       type: 'string',
    //     },
    //     {
    //       title: 'SITE WEB', data: 'siteWeb', render: function (data, type, row) {
    //         return row.siteWeb || '';
    //       },
    //       orderData: [1],
    //       orderSequence: ['asc', 'desc'],
    //       type: 'string',
    //     }
    //   ],
    //   createdRow: function (row, data, dataIndex) {
    //     // $('td:eq(0)', row).addClass('d-flex align-items-center');
    //     // $('td:last-child', row).addClass('d-flex flex-row align-middle');
    //   },
    // };
    // this.renderActionColumn();
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
                    <a type="button" class="dropdown-item" data-action="view" data-id="${full.idPersonne}">Afficher</a>
                </li>`;
        const edit = `
                <li>
                    <a type="button" class="dropdown-item" data-action="edit" data-id="${full.idPersonne}">Modifier</a>
                </li>`;
        const separator = `<li><hr class="dropdown-divider"></li>`;
        const delete1 = `<li>
                    <a type="button" class="dropdown-item" data-action="delete" data-id="${full.idPersonne}">Supprimer</a>
                </li>`;
        const parentActionEnd = `</ul>
            </div>`;
        const actions = [];
        actions.push(parentActionStart);
        actions.push(show);
        actions.push(edit);
        actions.push(separator);
        actions.push(delete1);
        actions.push(parentActionEnd);

        return actions.join('');
      }
    }
  }

  supprimer(id: string) {
    alert("Suppression");
    const modalRef = this.modalService.open(DeletePersonneMoraleModalComponent);
    modalRef.componentInstance.id = id;
    //modalRef.result.then(() => this.entityService.fetch(), () => {});
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

