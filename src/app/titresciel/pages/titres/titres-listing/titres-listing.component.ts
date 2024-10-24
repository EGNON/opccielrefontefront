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
import {BehaviorSubject, Observable, Subscription} from "rxjs";
import {DataTablesResponse} from "../../../../crm/models/data-tables.response.model";
import {Config} from "datatables.net";
import {SwalComponent} from "@sweetalert2/ngx-sweetalert2";
import {SweetAlertOptions} from "sweetalert2";
import {NgbModal, NgbModalOptions} from "@ng-bootstrap/ng-bootstrap";
import {PageInfoService} from "../../../../template/_metronic/layout";
import {ActivatedRoute, Router} from "@angular/router";
import {map} from "rxjs/operators";
import { ChangerQualitePersonneComponent } from "../../../../core/pages/modal/changer-qualite-personne/changer-qualite-personne.component";
import {QualiteTitreModel} from "../../../models/qualite-titre.model";
import {QualiteTitreService} from "../../../services/qualite-titre.service";
import {TitreService} from "../../../services/titre.service";
import {TableauAmortissementComponent} from "../../modal/tableau-amortissement/tableau-amortissement.component";

@Component({
  selector: 'app-titres-listing',
  templateUrl: './titres-listing.component.html',
  styleUrl: './titres-listing.component.scss'
})
export class TitresListingComponent implements OnInit, OnDestroy, AfterViewInit{
  entity: any;
  newButtonTitle: string = "Nouveau";
  searchButtonTitle = 'Rechercher ';
  title: string;
  isLoading: boolean = false;
  private subscriptions: Subscription[] = [];
  personnes: DataTablesResponse<any>;
  qualite: QualiteTitreModel;

  datatableConfig: Config = {};

  @ViewChild('noticeSwal')
  noticeSwal!: SwalComponent;
  swalOptions: SweetAlertOptions = {};

  // Reload emitter inside datatable
  reloadEvent: EventEmitter<boolean> = new EventEmitter();
  changeTableEvent: EventEmitter<boolean> = new EventEmitter();

  private clickListener: () => void;
  private idInAction: number;

  qualites$: Observable<any>;
  qualite$: BehaviorSubject<QualiteTitreModel> = new BehaviorSubject<QualiteTitreModel>({id: null, idQualite: 0, libelleQualite: '', classeTitre: null});
  id$: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  tabIndex$: BehaviorSubject<number> = new BehaviorSubject(1);
  tabIndex: number = 0;

  showForm: BehaviorSubject<number> = new BehaviorSubject(0);
  voyelles: string[] = [];
  id: number;

  modalConfig: NgbModalOptions = {
    size: 'xl',
    modalDialogClass: 'modal-dialog',
    backdrop: "static"
  };

  //Specific variables
  dtRendered = true;
  currentTabOldIndex: number = 0;
  currentTabIndex$: BehaviorSubject<number> = new BehaviorSubject(0);
  currentTabQualite$: BehaviorSubject<any> = new BehaviorSubject(null);

  constructor(
    private pageInfo: PageInfoService,
    private renderer: Renderer2,
    public entityService: TitreService,
    private qualiteService: QualiteTitreService,
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
    let qualiteActive: QualiteTitreModel = null;
    this.qualites$ = this.getAllQualites().pipe(
      map(resp => {
        console.log("Resp === ", resp);
        let qualites: QualiteTitreModel[] = resp.data;
        if(qualites && qualites.length > 0)
        {
          qualiteActive = qualites[0];
          if(qualiteActive != null && qualiteActive.idQualite > 0) {
            const lib = qualiteActive.libelleQualite;
            this.title = "Liste des " + lib.toLowerCase() + (lib[lib.length-1].toLowerCase() === 's' ? '' : 's');
            this.pageInfo.updateTitle(this.title);
            this.newButtonTitle = lib ? ((this.voyelles.includes(lib[0]) ? 'Nouvel ' : 'Nouveau ') + `${lib}`) : this.newButtonTitle;
            this.changerQualite(qualiteActive, 0);
          }
        }
        return qualites;
      }),
    );
  }

  getDataTableConfig() {
    let columns: any[];
    let lib = this.qualite.libelleQualite.toLowerCase().trim();
    switch (lib) {
      default:
        columns = [
          {
            title: 'Symbol', data: 'symbolTitre', render: function (data:any, type:any, full:any) {
              return full.symbolTitre || '';
            }
          },
          {
            title: 'Désignation', data: 'designationTitre', render: function (data:any, type:any, full:any) {
              return full.designationTitre || '';
            }
          },
          {
            title: 'Pays', data: 'pays', render: function (data: any, type: any, row: any) {
              const pays = row.pays;
              if(!pays)
                return '';

              return pays.libelleFr;
            },
            orderData: [1],
            orderSequence: ['asc', 'desc'],
            type: 'string',
          },
          {
            title: 'Type de titre', data: 'typeTitre', render: function (data:any, type:any, full:any) {
              const typeTitre = full.typeTitre;
              if(!typeTitre)
                return '';

              return typeTitre.libelleTypeTitre;
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
                    <a type="button" class="dropdown-item" data-qualite="${this.qualite.idQualite}" data-action="view" data-id="${full.idTitre}">Afficher</a>
                </li>`;
        const edit = `
                <li>
                    <a type="button" class="dropdown-item" data-qualite="${this.qualite.idQualite}" data-action="edit" data-id="${full.idTitre}">Modifier</a>
                </li>`;
        const separator = `<li><hr class="dropdown-divider"></li>`;
        const delete1 = `<li>
                    <a type="button" class="dropdown-item" hasPermission = "CAN_DELETE" data-qualite="${this.qualite.idQualite}" data-action="delete" data-id="${full.idTitre}">Supprimer</a>
                </li>`;
        /*const autresQualites = `
                <li>
                    <a type="button" class="dropdown-item" data-qualite="${this.qualite.idQualite}" data-action="quality" data-id="${full.idTitre}">Attribuer d'autres qualités</a>
                </li>`;*/
        const tabAmorti = `
                <li>
                    <a type="button" class="dropdown-item"  data-qualite="${this.qualite.libelleQualite}" data-action="tabamorti" data-id="${full.idTitre}">Tableau d'amortissement</a>
                </li>`;
        const parentActionEnd = `</ul></div>`;
        const actions = [];
        actions.push(parentActionStart);
        actions.push(show);
        actions.push(edit);
        actions.push(tabAmorti);
        // actions.push(autresQualites);
        actions.push(separator);
        actions.push(delete1);
        actions.push(parentActionEnd);
        return actions.join('');
      },
    });
    this.datatableConfig = {
      // serverSide: true,
      ajax: (dataTablesParameters: any, callback: any) => {
        const sb = this.entityService.afficherTousSelonQualite(dataTablesParameters, this.qualite.libelleQualite, "Tcn")
          .subscribe(resp => {
            callback(resp.data);
          });
        this.subscriptions.push(sb);
      },
      columns: columns
    };
  }

  ngOnDestroy(): void {
    if (this.clickListener) {
      this.clickListener();
    }
    this.subscriptions.forEach((sb) => sb.unsubscribe());
  }

  changeForm(action = null, id: number = 0, qualite: any = 0) {
    this.id$.next(id);
    switch (action) {
      case 'view':
        this.showForm.next(2);
        break;

      case 'create':
        this.showForm.next(1);
        break;

      case 'edit':
        this.showForm.next(1);
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

      case 'tabamorti':
        // const modalRef = this.modalService.open(ChangerQualitePersonneComponent, this.modalConfig);
        const modalRef1 = this.modalService.open(TableauAmortissementComponent, this.modalConfig);
        modalRef1.componentInstance.id = id;
        modalRef1.componentInstance.qualite = qualite;
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
    this.showForm.next(showForm);
  }

  changerQualite(qualite: any, index: number) {
    const lib = qualite.libelleQualite;
    this.qualite = qualite;
    this.title = "Liste des " + lib.toLowerCase() + (lib[lib.length-1].toLowerCase() === 's' ? '' : 's');
    this.pageInfo.updateTitle(this.title);
    this.newButtonTitle = lib ? `Ajouter ${lib}` : this.newButtonTitle;
    this.showForm.next(0);

    //New
    this.changeTableEvent.emit(true);
    this.getDataTableConfig();
  }

  getAllQualites() {
    return this.qualiteService.afficherTous();
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
