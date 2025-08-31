import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  OnDestroy,
  OnInit,
  Renderer2,
  ViewChild
} from '@angular/core';
import {BehaviorSubject, Observable, Subscription, tap} from "rxjs";
import {DataTablesResponse} from "../../../../crm/models/data-tables.response.model";
import {SwalComponent} from "@sweetalert2/ngx-sweetalert2";
import {SweetAlertOptions} from "sweetalert2";
import {PersonnePhysiqueService} from "../../../../crm/services/personne/personne.physique.service";
import {ActivatedRoute, Router} from "@angular/router";
import {NgbModal, NgbModalOptions} from "@ng-bootstrap/ng-bootstrap";
import {map} from "rxjs/operators";
import {QualiteService} from "../../../../crm/services/qualite.service";
import {Qualite} from "../../../../crm/models/qualite.model";
import {PageInfoService} from "../../../../template/_metronic/layout";
import {ChangerQualitePersonneComponent} from "../../modal/changer-qualite-personne/changer-qualite-personne.component";
declare var $:JQueryStatic;
import {Config} from "datatables.net";

@Component({
    selector: 'app-physique-listing',
    templateUrl: './physique-listing.component.html',
    styleUrl: './physique-listing.component.scss',
    standalone: false
})
export class PhysiqueListingComponent implements OnInit, AfterViewInit, OnDestroy{
  entity: any;
  newButtonTitle: string = "Nouveau";
  searchButtonTitle = 'Rechercher ';
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

  qualites$: Observable<any>;
  qualite$: BehaviorSubject<Qualite> = new BehaviorSubject<Qualite>({id: null, idQualite: 0, libelleQualite: ''});
  id$: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  tabIndex$: BehaviorSubject<number> = new BehaviorSubject(1);
  tabIndex: number = 0;

  showForm = 0;
  voyelles: string[] = [];
  id: number;

  modalConfig: NgbModalOptions = {
    modalDialogClass: 'modal-dialog mw-650px',
    backdrop: "static"
  };

  constructor(
    private pageInfo: PageInfoService,
    private renderer: Renderer2,
    public entityService: PersonnePhysiqueService,
    private qualiteService: QualiteService,
    private route: ActivatedRoute,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private modalService: NgbModal) {}

  ngAfterViewInit(): void {
    this.clickListener = this.renderer.listen(document, 'click', (event) => {
      const closestBtn = event.target.closest('.btn, .dropdown-item');
      if (closestBtn) {
        const { action, id, qualite } = closestBtn.dataset;
        this.idInAction = id;
        this.id = id;
        this.changeForm(action, id, qualite);
      }
    });
  }

  ngOnInit(): void {
    this.voyelles = ['a', 'e', 'y', 'u', 'i', 'o'];
    this.qualites$ = this.getAllQualites().pipe(
      map(resp => {
        let qualites: Qualite[] = resp.data;
        if(qualites && qualites.length > 0)
        {
          const lib = qualites[0].libelleQualite;
          this.title = "Liste des " + lib.toLowerCase() + (lib[lib.length-1].toLowerCase() === 's' ? '' : 's');
          this.pageInfo.updateTitle(this.title);
          this.newButtonTitle = lib ? ((this.voyelles.includes(lib[0]) ? 'Nouvel ' : 'Nouveau ') + `${lib}`) : this.newButtonTitle;
        }
        return qualites;
      }),
    );
  }

  getDataTableConfig(qualite: Qualite) {
    let columns: any[];
    let lib = qualite.libelleQualite.toLowerCase().trim();
    switch (lib) {
      case 'prospect':
        columns = [
          {
            title: 'Civilité', data: 'civilite', render: function (data:any, type:any, full:any) {
              return full.civilite || '';
            }
          },
          {
            title: 'Dénomination', data: 'nom', render: function (data:any, type:any, full:any) {
              return full.denomination || '';
            }
          },
          {
            title: 'Mobile 1', data: 'mobile1', render: function (data: any, type: any, row: any) {
              const roleName = row.mobile1;
              return roleName || '';
            },
            orderData: [1],
            orderSequence: ['asc', 'desc'],
            type: 'string',
          },
          {
            title: 'Nationalité', data: 'paysNationalite', render: function (data: any, type: any, row: any) {
              const pays = row.paysNationalite;
              if(!pays)
                return '';

              return pays.libelleFr;
            },
            orderData: [1],
            orderSequence: ['asc', 'desc'],
            type: 'string',
          },
          {
            title: 'Mode d\'établissement', data: 'modeEtablissementDto', render: function (data:any, type:any, full:any) {
              const mode = full.modeEtablissementDto;
              if(!mode)
                return '';

              return mode.libelle;
            }
          },
        ];
        break;
      default:
        columns = [
          {
            title: 'N° Compte SGI', data: 'numeroCpteDeposit', render: function (data:any, type:any, row:any) {
              const numeroCpteDeposit = row.numeroCpteDeposit;
              return numeroCpteDeposit || '';
            },
            orderData: [1],
            orderSequence: ['asc', 'desc'],
            type: 'string',
          },
          {
            title: 'Civilité', data: 'civilite', render: function (data:any, type:any, full:any) {
              return full.civilite || '';
            }
          },
          {
            title: 'Dénomination', data: 'nom', render: function (data:any, type:any, full:any) {
              return full.denomination || '';
            }
          },
          {
            title: 'Mobile 1', data: 'mobile1', render: function (data: any, type: any, row: any) {
              const roleName = row.mobile1;
              return roleName || '';
            },
            orderData: [1],
            orderSequence: ['asc', 'desc'],
            type: 'string',
          },
          {
            title: 'Nationalité', data: 'paysNationalite', render: function (data: any, type: any, row: any) {
              const pays = row.paysNationalite;
              if(!pays)
                return '';

              return pays.libelleFr;
            },
            orderData: [1],
            orderSequence: ['asc', 'desc'],
            type: 'string',
          },
          {
            title: 'Mode d\'établissement', data: 'modeEtablissementDto', render: function (data:any, type:any, full:any) {
              const mode = full.modeEtablissementDto;
              if(!mode)
                return '';

              return mode.libelle;
            }
          },
        ];
        break;
    }
    columns.push({
      sortable: false,
      title: 'Actions',
      class:'text-end min-w-70px',
      render: (data: any, type: any, full: any) => {
        const parentActionStart = `
                <div class="btn-group">
                    <button type="button" class="btn btn-sm btn-primary dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
                      Action
                    </button>
                    <ul class="dropdown-menu">`;
        const show = `
                <li>
                    <a type="button" class="dropdown-item" data-qualite="${qualite.idQualite}" data-action="view" data-id="${full.idPersonne}">Afficher</a>
                </li>`;
        const edit = `
                <li>
                    <a type="button" class="dropdown-item" data-qualite="${qualite.idQualite}" data-action="edit" data-id="${full.idPersonne}">Modifier</a>
                </li>`;
        const separator = `<li><hr class="dropdown-divider"></li>`;
        const delete1 = `<li>
                    <a type="button" class="dropdown-item" hasPermission = "CAN_DELETE" data-qualite="${qualite.idQualite}" data-action="delete" data-id="${full.idPersonne}">Supprimer</a>
                </li>`;
        const autresQualites = `
                <li>
                    <a type="button" class="dropdown-item" data-qualite="${qualite.idQualite}" data-action="quality" data-id="${full.idPersonne}">Attribuer d'autres qualités</a>
                </li>`;
        const parentActionEnd = `</ul>
            </div>`;
        const actions = [];
        actions.push(parentActionStart);
        actions.push(show);
        actions.push(edit);
        actions.push(separator);
        actions.push(delete1);
        actions.push(autresQualites);
        actions.push(parentActionEnd);

        return actions.join('');
      },
    });
    let config = {
      serverSide: true,
      ajax: (dataTablesParameters: any, callback: any) => {
        console.log("Param === ", dataTablesParameters);
        const sb = this.entityService.getPersonnes(dataTablesParameters, qualite.libelleQualite)
          .subscribe(resp => {
            console.log("Datatable Res === ", resp);
            callback(resp);
          });
        this.subscriptions.push(sb);
      },
      columns: columns
    };
    this.datatableConfig = config;

    return config;
  }

  ngOnDestroy(): void {
    if (this.clickListener) {
      this.clickListener();
    }
    this.subscriptions.forEach((sb) => sb.unsubscribe());
  }

  changeForm(action = null, id: number = 0, qualite: number = 0) {
    this.id$.next(id);
    switch (action) {
      case 'view':
        this.showForm = 2;
        break;

      case 'create':
        this.showForm = 1;
        break;

      case 'edit':
        this.showForm = 1;
        break;

      case 'quality':
        // const modalRef = this.modalService.open(ChangerQualitePersonneComponent, this.modalConfig);
        const modalRef = this.modalService.open(ChangerQualitePersonneComponent, this.modalConfig);
        modalRef.componentInstance.id = id;
        /*modalRef.componentInstance.passEntry.subscribe((receivedEntry:any) => {
          //this.currentOpcvm = receivedEntry;
          //console.log("RESP === ", receivedEntry);
        });*/
        break;

      case 'delete':
        this.supprimer(id.toString());
        break;
    }
  }

  retourAlaListe(showForm: any) {
    this.showForm = showForm;
  }

  changerQualite(qualite: any, index: number) {
    const lib = qualite.libelleQualite;
    this.title = "Liste des " + lib.toLowerCase() + (lib[lib.length-1].toLowerCase() === 's' ? '' : 's');
    this.pageInfo.updateTitle(this.title);
    this.newButtonTitle = lib ? ((this.voyelles.includes(lib[0]) ? 'Nouvel ' : 'Nouveau ') + `${lib}`) : this.newButtonTitle;
    this.showForm = 0;
    this.qualite$.next(qualite);
    this.tabIndex = index;
    this.tabIndex$.next(index);
  }

  getAllQualites() {
    return this.qualiteService.afficherListe();
  }

  renderActionColumn(): void {
    if (this.datatableConfig.columns) {
      let actions = this.datatableConfig.columns[this.datatableConfig.columns?.length-1];
      if(!(actions != null && actions.title?.toLowerCase() === "actions"))
      {
        const actionColumn = {
          sortable: false,
          title: 'Actions',
          class:'text-end min-w-70px',
          render: (data: any, type: any, full: any) => {
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
            actions.push(edit);
            actions.push(separator);
            actions.push(delete1);
            actions.push(parentActionEnd);

            return actions.join('');
          },
        };
        this.datatableConfig.columns.push(actionColumn);
      }
      /*actions.render = (data: any, type: any, full: any) => {
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
        actions.push(edit);
        actions.push(separator);
        actions.push(delete1);
        actions.push(parentActionEnd);

        return actions.join('');
      }*/
    }
  }

  supprimer(id: string) {
    /*const modalRef = this.modalService.open(Dele);
    modalRef.componentInstance.id = id;
    modalRef.result.then(() => this.entityService.fetch(), () => {});*/
  }
}
