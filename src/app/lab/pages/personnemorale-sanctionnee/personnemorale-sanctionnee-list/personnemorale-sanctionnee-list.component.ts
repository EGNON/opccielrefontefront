import {AfterViewInit, Component, EventEmitter, OnDestroy, OnInit, Renderer2} from '@angular/core';
import {Observable, Subscription} from "rxjs";
import {SweetAlertOptions} from "sweetalert2";
import {ActivatedRoute, Router} from "@angular/router";
import {AuthService} from "../../../../core/modules/auth";
import {PersonneMoraleService} from "../../../../crm/services/personne/personne.morale.service";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {
  DeletePersonnemoraleSanctionneeModalComponent
} from "../delete-personnemorale-sanctionnee-modal/delete-personnemorale-sanctionnee-modal.component";
import {Config} from "datatables.net";

@Component({
    selector: 'app-personnemorale-sanctionnee-list',
    templateUrl: './personnemorale-sanctionnee-list.component.html',
    styleUrl: './personnemorale-sanctionnee-list.component.scss',
    standalone: false
})
export class PersonnemoraleSanctionneeListComponent implements OnInit, OnDestroy, AfterViewInit{
  isLoading: boolean;
  private subscriptions: Subscription[] = [];

  aEntity: Observable<any>;
  compteRendu: any;
  datatableConfig: Config = {};
  etat:any;
  // Reload emitter inside datatable
  reloadEvent: EventEmitter<boolean> = new EventEmitter();

  swalOptions: SweetAlertOptions = {};

  private clickListener: () => void;
  private idInAction: number;

  constructor(
    private route: ActivatedRoute,
    private renderer: Renderer2,
    private authService: AuthService,
    public personneMoraleService: PersonneMoraleService,
    private router: Router,
    private modalService: NgbModal) {}

  ngOnInit(): void {
    this.afficherPersonneMoralePolitiquementJuge();
  }

  ngOnDestroy(): void {
    if (this.clickListener) {
      this.clickListener();
    }
    this.subscriptions.forEach((sb) => sb.unsubscribe());
  }
  afficherPersonneMoralePolitiquementJuge(){
    this.datatableConfig = {
      serverSide: true,
      ajax: (dataTablesParameters: any, callback) => {
        const sb = this.personneMoraleService.getPersonneExpose(dataTablesParameters)
          .subscribe(resp => {
            callback(resp);
            console.log("Personne=",resp)
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
          title: 'PAYS DE RESIDENCE', data: 'paysResidence', render: function (data, type, row) {
            return row.paysResidence.libelleFr || '';
          },
          orderData: [1],
          orderSequence: ['asc', 'desc'],
          type: 'string',
        },
        {
          title: 'est jugée', data: 'estJuge', render: function (data, type, row) {
            // if(row.estGafi==false)
            return `<div class="badge ${row.estJuge ? 'badge-danger' : 'badge-success'} fw-bold">${row.estJuge ? 'OUI' : 'NON'}</div>`;
            // else
            //   return 'OUI';
          }
        },
        {
          title: 'est exposé', data: 'estExpose', render: function (data, type, row) {
            // if(row.estGafi==false)
            return `<div class="badge ${row.estExpose ? 'badge-danger' : 'badge-success'} fw-bold">${row.estExpose ? 'OUI' : 'NON'}</div>`;
            // else
            //   return 'OUI';
          }
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
        //actions.push(show);
        actions.push(edit);
       /*  actions.push(separator);
        actions.push(delete1); */
        actions.push(parentActionEnd);

        return actions.join('');
      }
    }
  }

  supprimer(id: number) {
    const modalRef = this.modalService.open(DeletePersonnemoraleSanctionneeModalComponent);
    modalRef.componentInstance.id = id;
    //modalRef.result.then(() => this.personneMoraleService.fetch(), () => {});
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
}


