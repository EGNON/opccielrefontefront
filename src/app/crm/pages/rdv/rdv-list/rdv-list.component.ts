import {AfterViewInit, Component, EventEmitter, Input, OnDestroy, OnInit, Renderer2} from '@angular/core';
import {Observable, Subscription} from "rxjs";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {RdvService} from "../../../services/rdv.service";
import {DeleteRdvModalComponent} from "../delete-rdv-modal/delete-rdv-modal.component";
import {Compterendu} from "../../../models/compterendu.model";
import {SweetAlertOptions} from "sweetalert2";
import {ActivatedRoute, Router} from "@angular/router";
import moment from "moment";
import {AuthService} from "../../../../core/modules/auth";
import {Config} from "datatables.net";

@Component({
  selector: 'app-rdv-list',
  templateUrl: './rdv-list.component.html',
  styleUrls: ['./rdv-list.component.scss']
})
export class RdvListComponent implements OnInit, OnDestroy, AfterViewInit{
  isLoading: boolean;
  compteRendu$: Observable<Compterendu[]>;
  private subscriptions: Subscription[] = [];

  aEntity: Observable<any>;
  compteRendu: any;
  compteRendus: Compterendu[];
  datatableConfig: Config = {};

  // Reload emitter inside datatable
  reloadEvent: EventEmitter<boolean> = new EventEmitter();

  swalOptions: SweetAlertOptions = {};

  private clickListener: () => void;
  private idInAction: number;

  constructor(
    private route: ActivatedRoute,
    private renderer: Renderer2,
    private authService: AuthService,
    public rdvService: RdvService,
    private router: Router,
    private modalService: NgbModal) {}

  ngOnInit(): void {
    this.afficherRdv();
  }

  ngOnDestroy(): void {
    if (this.clickListener) {
      this.clickListener();
    }
    this.subscriptions.forEach((sb) => sb.unsubscribe());
  }

  afficherRdv(){
    this.datatableConfig = {
      serverSide: true,
      ajax: (dataTablesParameters: any, callback) => {
        const sb = this.rdvService.afficherTous(dataTablesParameters)
          .subscribe(resp => {
            callback(resp);
          });
        this.subscriptions.push(sb);
      },
      columns: [
        {
          title: 'Date début', data: 'dateDebRdv', render: function (data, type, row) {
            return moment(row.dateDebRdv).format('DD-MM-YYYY');
          },
        },
        {
          title: 'Objet', data: 'objet', render: function (data, type, row) {
            return row.objetRdv;
          },
        },
        {
          title: 'Date fin', data: 'dateFinRdv', render: function (data, type, row) {
            return moment(row.dateFinRdv).format('DD-MM-YYYY');
          },
        },
        {
          title: 'heure fin', data: 'heureFinRdv', render: function (data, type, row) {
            return row.heureFinRdv;
          },
        },
        {
          title: 'client/prospect', data: 'denomination', render: function (data, type, row) {
            return row.personnePhysiqueMoraleDto.denomination;
          },
        },
        {
          title: 'ville', data: 'libelleCommune', render: function (data, type, row) {
            return row.communeDto.libelleCommune;
          },
        },
      ],
      createdRow: function (row, data, dataIndex) {
        $('td:eq(0)', row).addClass('d-flex align-items-center');
        // $('td:last-child', row).addClass('d-flex flex-row align-middle');
      },
    };
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
                    <a type="button" class="dropdown-item" data-action="view" data-id="${full.idRdv}">Afficher</a>
                </li>`;
        const edit = `
                <li>
                    <a type="button" class="dropdown-item" data-action="edit" data-id="${full.idRdv}">Modifier</a>
                </li>`;
        const update = `
                <li>
                    <a type="button" class="dropdown-item" data-action="update" data-id="${full.idRdv}">Infos réelles</a>
                </li>`;
        const separator = `<li><hr class="dropdown-divider"></li>`;
        const delete1 = `<li>
                    <a type="button" class="dropdown-item" data-action="delete" data-id="${full.idRdv}">Supprimer</a>
                </li>`;
        const parentActionEnd = `</ul>
            </div>`;
        const actions = [];
        actions.push(parentActionStart);
        actions.push(show);
        if(full.dateDebReelle===null)
          actions.push(edit);

        actions.push(update);
        if(full.dateDebReelle===null)
        {
          actions.push(separator);
          actions.push(delete1);
        }
        actions.push(parentActionEnd);

        return actions.join('');
      }
    }
  }

  supprimer(id: number) {
    const modalRef = this.modalService.open(DeleteRdvModalComponent);
    modalRef.componentInstance.id = id;
    //modalRef.result.then(() => this.rdvService.fetchRows(null), () => {});
  }

  ngAfterViewInit(): void {
    this.renderActionColumn();
    this.clickListener = this.renderer.listen(document, 'click', (event) => {
      const closestBtn = event.target.closest('.btn, .dropdown-item');
      if (closestBtn) {
        const { action, id } = closestBtn.dataset;
        this.idInAction = id;
        switch (action) {

          case 'create':
            this.router.navigate(['new'], {relativeTo: this.route});
            break;

          case 'nouveau':
            this.router.navigate(['nouveau'], {relativeTo: this.route});
            break;

          case 'edit':
            this.router.navigate(['edit', id], {relativeTo: this.route});
            break;

            case 'view':
            this.router.navigate(['view', id], {relativeTo: this.route});
            break;

          case 'delete':
            this.supprimer(id);
            break;

          case 'update':
            this.router.navigate(['update', id], {relativeTo: this.route});
            break;
        }
      }
    });
  }
}
//OnInit, OnDestroy{
//   isLoading: boolean;
//   private subscriptions: Subscription[] = [];
//   rdv$:any;
//   @Input() selectedItem: any; // Variable pour stocker l'élément sélectionné
//   items: any[] = [ /* Votre tableau d'objets */ ]; // Tableau contenant les données de la table
//
//   constructor(
//     public rdvService: RdvService,
//     private modalService: NgbModal,
//     private fb: FormBuilder) {}
//
//   ngOnInit(): void {
//     // const sb = this.rdvService.isLoading$.subscribe(res => this.isLoading = res);
//     // this.subscriptions.push(sb);
//     // this.rdvService.fetch();
//     this.afficherRdv();
//     // this.rdvService.fetch();
//   }
//
//   ngOnDestroy(): void {
//     this.subscriptions.forEach((sb) => sb.unsubscribe());
//   }
//   selectItem(item: any) {
//     this.selectedItem = item;
//   }
//   supprimer(id: number) {
//     const modalRef = this.modalService.open(DeleteRdvModalComponent);
//     modalRef.componentInstance.id = id;
//     modalRef.result.then(() => this.rdvService.fetch(), () => {});
//   }
//   afficherRdv(){
//     this.rdvService.afficherRDVListe().subscribe(
//       (data) => {
//         this.rdv$=data;
//         console.log(this.rdv$);
//       }
//     );
//   }
//
//   protected readonly style = style;
// }
