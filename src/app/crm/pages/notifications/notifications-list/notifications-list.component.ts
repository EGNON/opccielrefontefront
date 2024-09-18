import {AfterViewInit, Component, EventEmitter, OnDestroy, OnInit, Renderer2} from '@angular/core';
import {Observable, Subscription} from "rxjs";
import {SweetAlertOptions} from "sweetalert2";
import {ActivatedRoute, Router} from "@angular/router";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {AlerteService} from "../../../services/alerte.service";
import {DeleteNotificationsModalComponent} from "../delete-notifications-modal/delete-notifications-modal.component";
import {Compterendu} from "../../../models/compterendu.model";
import moment from "moment/moment";
import {AuthService} from "../../../../core/modules/auth";
import {Config} from "datatables.net";

@Component({
  selector: 'app-notifications-list',
  templateUrl: './notifications-list.component.html',
  styleUrls: ['./notifications-list.component.scss']
})
export class NotificationsListComponent implements OnInit, OnDestroy, AfterViewInit{
  isLoading: boolean;
  compteRendu$: Observable<Compterendu[]>;
  private subscriptions: Subscription[] = [];

  aEntity: Observable<any>;
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
    public alerteService: AlerteService,
    private router: Router,
    private modalService: NgbModal) {}

  ngOnInit(): void {
    this.afficherAlerte();
  }

  ngOnDestroy(): void {
    if (this.clickListener) {
      this.clickListener();
    }
    this.subscriptions.forEach((sb) => sb.unsubscribe());
  }
  afficherAlerte(){
    this.datatableConfig = {
      serverSide: true,
      ajax: (dataTablesParameters: any, callback) => {
        const sb = this.alerteService.afficherTous(dataTablesParameters)
          .subscribe(resp => {
            callback(resp);
          });
        this.subscriptions.push(sb);
      },
      columns: [
        {
          title: 'Type planification', data: 'typePlanification', render: function (data, type, row) {
            return row.typePlanification?.libelleTypePlanification;
          },
        },
        {
          title: 'Périodicité', data: 'periodicite', render: function (data, type, row) {
            return row.periodicite?.libelle || '';
          },
        },
        {
          title: 'Date début', data: 'dateDebut', render: function (data, type, row) {
            return moment(row.dateDebut).format('DD-MM-YYYY');
          },
        },
        {
          title: 'Date fin', data: 'dateFin', render: function (data, type, row) {
            return row.dateFin ? moment(row.dateFin).format('DD MMM YYYY') : '-';
          },
        },
        {
          title: 'Fréquence', data: 'frequence', render: function (data, type, row) {
            return row.frequence;
          },
        },
        {
          title: 'Heure début', data: 'heureDebut', render: function (data, type, row) {
            return row.heureDebut;
          },
        },
        {
          title: 'Heure fin', data: 'heureFin', render: function (data, type, row) {
            return row.heureFin;
          },
        }
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
                    <a type="button" class="dropdown-item" data-action="view" data-id="${full.idAlerte}">Afficher</a>
                </li>`;
        const edit = `
                <li>
                    <a type="button" class="dropdown-item" data-action="edit" data-id="${full.idAlerte}">Modifier</a>
                </li>`;
        const separator = `<li><hr class="dropdown-divider"></li>`;
        const delete1 = `<li>
                    <a type="button" class="dropdown-item" data-action="delete" data-id="${full.idAlerte}">Supprimer</a>
                </li>`;
        const parentActionEnd = `</ul>
            </div>`;
        const actions = [];
        actions.push(parentActionStart);
        // actions.push(show);
        /*actions.push(edit);
        actions.push(separator);*/
        actions.push(delete1);
        actions.push(parentActionEnd);

        return actions.join('');
      }
    }
  }

  supprimer(id: number) {
    const modalRef = this.modalService.open(DeleteNotificationsModalComponent);
    modalRef.componentInstance.id = id;
    modalRef.result.then(() => this.alerteService.fetchRows(null), () => {});
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
}//OnInit, AfterViewInit, OnDestroy{

//   entity: any;
//   newButtonTitle: string = "Nouvelle Alerte";
//   entities$: any;
//   title: string;
//   isLoading: boolean = false;
//   private subscriptions: Subscription[] = [];
//   alertes: DataTablesResponse;
//
//   datatableConfig: Config = {};
//
//   @ViewChild('noticeSwal')
//   noticeSwal!: SwalComponent;
//   swalOptions: SweetAlertOptions = {};
//
//   // Reload emitter inside datatable
//   reloadEvent: EventEmitter<boolean> = new EventEmitter();
//   aAlerte: Observable<Alerte>;
//
//   constructor(
//     public entityService: AlerteService,
//     private route: ActivatedRoute,
//     private router: Router,
//     private cdr: ChangeDetectorRef,
//     private modalService: NgbModal) {}
//
//   ngAfterViewInit(): void {}
//
//   ngOnInit(): void {
//     const sb = this.entityService.isLoading$.subscribe(res => this.isLoading = res);
//     this.subscriptions.push(sb);
//     this.entityService.fetch();
//     this.entities$ = this.entityService.items$;
//   }
//
//   ngOnDestroy(): void {
//     this.subscriptions.forEach((sb) => sb.unsubscribe());
//   }
//
//   showAlert(swalOptions: SweetAlertOptions) {
//     let style = swalOptions.icon?.toString() || 'success';
//     if (swalOptions.icon === 'error') {
//       style = 'danger';
//     }
//     this.swalOptions = Object.assign({
//       buttonsStyling: false,
//       confirmButtonText: "Ok, got it!",
//       customClass: {
//         confirmButton: "btn btn-" + style
//       }
//     }, swalOptions);
//     this.cdr.detectChanges();
//     this.noticeSwal.fire();
//   }
//
//   supprimer(id: string) {
//     const modalRef = this.modalService.open(DeleteNotificationsModalComponent);
//     modalRef.componentInstance.id = id;
//     modalRef.result.then(() => this.entityService.fetch(), () => {});
//   }
// }
