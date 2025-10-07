import {AfterViewInit, Component, EventEmitter, OnDestroy, OnInit, Renderer2, ViewChild} from '@angular/core';
import {Observable, Subscription} from "rxjs";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {Compterendu} from "../../../models/compterendu.model";
import {CompterenduService} from "../../../services/compterendu.service";
import {DeleteCompterenduModalComponent} from "../delete-compterendu-modal/delete-compterendu-modal.component";
import {filter, map} from "rxjs/operators";
import {SweetAlertOptions} from "sweetalert2";
import moment from "moment/moment";
import {ActivatedRoute, Router} from "@angular/router";
import {AuthService} from "../../../../core/modules/auth";
import {Config} from "datatables.net";

@Component({
    selector: 'app-compterendu-list',
    templateUrl: './compterendu-list.component.html',
    styleUrls: ['./compterendu-list.component.scss'],
    standalone: false
})
export class CompterenduListComponent implements OnInit, OnDestroy, AfterViewInit{
  isLoading: boolean;
  entities$: Observable<Compterendu[]>;
  private subscriptions: Subscription[] = [];

  aEntity: Observable<any>;
  entity: any;
  entities: Compterendu[];
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
    public entityService: CompterenduService,
    private router: Router,
    private modalService: NgbModal) {}

  ngOnInit(): void {
    this.datatableConfig = {
      serverSide: true,
      ajax: (dataTablesParameters: any, callback) => {
        const sb = this.entityService.afficherTous(dataTablesParameters)
          .pipe(
            filter((resp) => resp.data.length > 0),
            map(n => {
              console.log(n.data)
              const newData = n.data.filter(obj => obj.creerPar === this.authService.currentUserValue?.idPersonne);
              if(this.authService.currentUserValue?.username!=="admin")
                return {...n, data: newData};
              else
                return {...n, data: n.data};

              
            })
          )
          .subscribe(resp => {
            callback(resp);
        });
        this.subscriptions.push(sb);
      },
      columns: [
        {
          title: 'Objet', data: 'objetCR', render: function (data, type, row) {
            return row.objetCR;
          },
        },
        {
          title: 'Appréciation', data: 'sexe', render: function (data, type, row) {
            return row.appreciation;
          }
        },
        {
          title: 'Description', data: 'description', render: function (data, type, row) {
            return row.description;
          }
        },
        {
          title: 'Date prochain RDV', data: 'dateProchainRDV', render: function (data) {
            return moment(data).format('DD MMM YYYY, hh:mm a');
          }
        },
        {
          title: 'Etat', data: 'estValide', render: function (data, type, full) {
            const etat = data || full.estValide;
            return `<div class="badge ${etat ? 'badge-success' : 'badge-info'} fw-bold">${etat ? 'Validé' : 'En cours'}</div>`;
          }
        },
      ],
      createdRow: function (row, data, dataIndex) {
        $('td:eq(0)', row).addClass('d-flex align-items-center');
        // $('td:last-child', row).addClass('d-flex flex-row align-middle');
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
                    <a type="button" class="dropdown-item" data-action="view" data-id="${full.id}">Afficher</a>
                </li>`;
        const edit = `
                <li>
                    <a type="button" class="dropdown-item" data-action="edit" data-id="${full.id}">Modifier</a>
                </li>`;
        const validate = `
                <li>
                    <a type="button" class="dropdown-item" data-action="validate" data-id="${full.id}">Valider</a>
                </li>`;
        const separator = `<li><hr class="dropdown-divider"></li>`;
        const delete1 = `<li>
                    <a type="button" class="dropdown-item" data-action="delete" data-id="${full.id}">Supprimer</a>
                </li>`;
        const parentActionEnd = `</ul>
            </div>`;
        const actions = [];
        actions.push(parentActionStart);
        actions.push(show);
        if(!full.estValide) actions.push(validate);
        if(!full.estValide) actions.push(edit);
        if(!full.estValide) actions.push(separator);
        if(!full.estValide) actions.push(delete1);
        actions.push(parentActionEnd);

        return actions.join('');
      }
    }
  }

  supprimer(id: number) {
    const modalRef = this.modalService.open(DeleteCompterenduModalComponent);
    modalRef.componentInstance.id = id;
    //modalRef.result.then(() => this.entityService.fetchRows(null), () => {});
  }

  validateCR(idCR: number, request: any) {
    this.entityService.validateCR(idCR, request).subscribe({
      next: (value) => {
        let currentUrl = this.router.url;
        this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => {
          this.router.navigate([currentUrl]);
        });
      },
      error: err => {

      }
    })
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
            this.router.navigate(['view', id], {relativeTo: this.route});
            break;

          case 'validate':
            this.validateCR(id, {estValide: true});
            // closestBtn.classList.addClass('d-none');
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
