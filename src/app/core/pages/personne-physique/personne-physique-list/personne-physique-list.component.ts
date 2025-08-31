import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  OnDestroy,
  OnInit, Renderer2,
  ViewChild
} from '@angular/core';
import {Subscription, switchMap, tap} from "rxjs";
import {ActivatedRoute, NavigationExtras, Router} from "@angular/router";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {DeletePersonnePhysiqueModalComponent} from "../delete-personne-physique-modal/delete-personne-physique-modal.component";
import {filter, map} from "rxjs/operators";
import {SweetAlertOptions} from "sweetalert2";
import {SwalComponent} from "@sweetalert2/ngx-sweetalert2";
import {DataTablesResponse} from "../../../../crm/models/data-tables.response.model";
import {PersonnePhysiqueService} from "../../../../crm/services/personne/personne.physique.service";
import {Action} from "../../../modules/entity-crud/entity-crud.component";
import {Config} from "datatables.net";

@Component({
    selector: 'app-personne-physique-list',
    templateUrl: './personne-physique-list.component.html',
    styleUrls: ['./personne-physique-list.component.scss'],
    standalone: false
})
export class PersonnePhysiqueListComponent implements OnInit, AfterViewInit, OnDestroy{
  /*@HostBinding('class') class = 'menu menu-sub menu-sub-dropdown menu-column menu-rounded menu-gray-600 menu-state-bg-light-primary fw-semibold fs-6 w-200px py-4';
  @HostBinding('attr.data-kt-menu') dataKtMenu = 'true';*/

  qualite?: string | null;
  entity: any;
  newButtonTitle: string = "Nouveau";
  title: string;
  isLoading: boolean = false;
  private subscriptions: Subscription[] = [];
  personnes: DataTablesResponse<any>;

  datatableConfig: Config = {};

  @ViewChild('noticeSwal')
  noticeSwal!: SwalComponent;
  swalOptions: SweetAlertOptions = {};

  // Reload emitter inside datatable
  reloadEvent: EventEmitter<boolean> = new EventEmitter();

  private clickListener: () => void;
  private idInAction: number;

  actions: Action[];

  constructor(
    private renderer: Renderer2,
    public entityService: PersonnePhysiqueService,
    private route: ActivatedRoute,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private modalService: NgbModal) {
    // this.router.routeReuseStrategy.shouldReuseRoute = () => false;
  }

  ngAfterViewInit(): void {
    this.renderActionColumn();
    this.clickListener = this.renderer.listen(document, 'click', (event) => {
      const closestBtn = event.target.closest('.btn, .dropdown-item');
      if (closestBtn) {
        const { action, id } = closestBtn.dataset;
        this.idInAction = id;
        switch (action) {
          case 'convert':
            let navigationExtras: NavigationExtras = {
              queryParams: { 'estConverti': true },
              relativeTo: this.route,
              fragment: 'anchor'
            };

            this.router.navigate(['../', 'actionnaire', 'conversion', id, 'etat', 1], {relativeTo: this.route});
            break;

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

  ngOnInit(): void {
    this.actions = [
      {
        name: 'Afficher',
        path: `/app/standard/personne/physique/${this.qualite}/show/:id`,
        parameters: [{key: 'id', value: null}]
      },
      {
        name: 'Modifier',
        path: `/app/standard/personne/physique/${this.qualite}/edit/:id`,
        parameters: [{key: 'id', value: null}]
      },
      {
        name: 'Conversion en client',
        path: `/app/standard/personne/physique/${this.qualite}/conversion/:id/etat/:etat`,
        parameters: [
          {key: 'id', value: null},
          {key: 'etat', value: null},
        ]
      },
    ];
    this.datatableConfig = {
      serverSide: true,
      ajax: (dataTablesParameters: any, callback) => {
        const sb = this.route.paramMap
        .pipe(
          filter(paramMap => paramMap.has('qualite')),
          map(paramMap => paramMap.get('qualite')!),
          tap((qualite) => {
            const voyelles = ['a', 'e', 'y', 'u', 'i', 'o'];
            this.qualite = qualite;
            this.newButtonTitle = this.qualite ? ((voyelles.includes(this.qualite[0]) ? 'Nouvel ' : 'Nouveau ') + `${this.qualite}`) : this.newButtonTitle;
          }),
          switchMap((qualite) => this.entityService.getPersonnes(dataTablesParameters, qualite))
        ).subscribe(resp => {
          // console.log("DataTable Param = ", resp);
          callback(resp);
        });
        this.subscriptions.push(sb);
      },
      columns: [
        {
          title: 'N° Compte SGI', data: 'numeroCpteDeposit', render: function (data, type, row) {
            const numeroCpteDeposit = row.numeroCpteDeposit;
            return numeroCpteDeposit || '';
          },
          orderData: [1],
          orderSequence: ['asc', 'desc'],
          type: 'string',
        },
        {
          title: 'Dénomination', data: 'nom', render: function (data, type, full) {
            return full.denomination || '';
          }
        },
        {
          title: 'Mobile 1', data: 'mobile1', render: function (data, type, row) {
            const roleName = row.mobile1;
            return roleName || '';
          },
          orderData: [1],
          orderSequence: ['asc', 'desc'],
          type: 'string',
        }
      ],
      createdRow: function (row, data, dataIndex) {
        // $('td', row).each(function (index, value) {
        //   $(value).addClass('min-w-200px');
        //   console.log(`For index ${index}, data value is ${value}`);
        // });
        // $('td:eq(0)', row).addClass('d-flex align-items-center');
        // $('td:last-child', row).addClass('d-flex flex-row align-middle');
      },
    };
    //this.renderActionColumn();
  }

  ngOnDestroy(): void {
    if (this.clickListener) {
      this.clickListener();
    }
    this.subscriptions.forEach((sb) => sb.unsubscribe());
  }

  renderActionColumn(): void {
    /*const actionColumn = {
      sortable: false,
      title: 'Actions',
      render: (data: any, type: any, full: any) => {
        const parentDivStart = `<div class="text-end min-w-70px">`;
        const viewButton = `
            <button class="btn btn-sm btn-outline-info me-3" data-action="view" data-id="${full.idPersonne}">
                 Afficher
            </button>
        `;

        const editButton = `
            <button class="btn btn-sm btn-outline-primary me-3" data-action="edit" data-id="${full.idPersonne}">
              Modifier
            </button>
        `;

        const deleteButton = `
            <button class="btn btn-sm btn-outline-danger" data-action="delete" data-id="${full.idPersonne}">
              Supprimer
            </button>
        `;

        const conversionButton = `
            <button class="btn btn-sm btn-outline-warning me-3" data-action="convert" data-id="${full.idPersonne}">
                 Convertir
            </button>
        `;

        const parentDivEnd = `</div>`;

        const buttons = [];
        buttons.push(parentDivStart);
        buttons.push(viewButton);
        if(this.qualite?.toLowerCase() == 'prospect' && !full.estConvertie) buttons.push(conversionButton);
        if(
          (this.qualite?.toLowerCase() != 'prospect') ||
          (this.qualite?.toLowerCase() == 'prospect' && !full.estConvertie)
        )
        {
          buttons.push(editButton);
          buttons.push(deleteButton);
        }
        buttons.push(parentDivEnd);

        return buttons.join('');
      },
    };*/

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
        const conversionButton = `
                <li>
                    <a type="button" class="dropdown-item" data-action="convert" data-id="${full.idPersonne}">Convertir</a>
                </li>`;
        const parentActionEnd = `</ul>
            </div>`;
        const actions = [];
        actions.push(parentActionStart);
        actions.push(show);
        if(this.qualite?.toLowerCase() == 'prospect' && !full.estConvertie) actions.push(conversionButton);
        if(
          (this.qualite?.toLowerCase() != 'prospect') ||
          (this.qualite?.toLowerCase() == 'prospect' && !full.estConvertie)
        )
        {
          actions.push(edit);
          actions.push(separator);
          actions.push(delete1);
        }
        actions.push(parentActionEnd);

        return actions.join('');
      }
      //this.datatableConfig.columns.push(actionColumn);
    }
  }

  supprimer(id: string) {
    const modalRef = this.modalService.open(DeletePersonnePhysiqueModalComponent);
    modalRef.componentInstance.id = id;
    //modalRef.result.then(() => this.entityService.fetch(), () => {});
  }
}
