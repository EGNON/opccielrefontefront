import {AfterViewInit, Component, EventEmitter, OnDestroy, OnInit, Renderer2} from '@angular/core';
import {Observable, Subscription} from "rxjs";
import {SweetAlertOptions} from "sweetalert2";
import {ActivatedRoute, Router} from "@angular/router";
import {AuthService} from "../../../../core/modules/auth";
import {PersonnePhysiqueService} from "../../../../crm/services/personne/personne.physique.service";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {
  DeletePersonnephysiqueSanctionneeModalComponent
} from "../delete-personnephysique-sanctionnee-modal/delete-personnephysique-sanctionnee-modal.component";
import {Config} from "datatables.net";

@Component({
    selector: 'app-personnephysique-sanctionnee-list',
    templateUrl: './personnephysique-sanctionnee-list.component.html',
    styleUrl: './personnephysique-sanctionnee-list.component.scss',
    standalone: false
})
export class PersonnephysiqueSanctionneeListComponent implements OnInit, OnDestroy, AfterViewInit{
  isLoading: boolean;
  private subscriptions: Subscription[] = [];

  aEntity: Observable<any>;
  compteRendu: any;
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
    public personnePhysiqueService: PersonnePhysiqueService,
    private router: Router,
    private modalService: NgbModal) {}

  ngOnInit(): void {
    this.afficherPersonnePhysiqueSanctionnee();
  }

  ngOnDestroy(): void {
    if (this.clickListener) {
      this.clickListener();
    }
    this.subscriptions.forEach((sb) => sb.unsubscribe());
  }
  afficherPersonnePhysiqueSanctionnee(){
    this.datatableConfig = {
      serverSide: true,
      ajax: (dataTablesParameters: any, callback) => {
        const sb = this.personnePhysiqueService.getPersonneExpose(dataTablesParameters)
          .subscribe(resp => {
            callback(resp);
            console.log("Personne=",resp)
          });
        this.subscriptions.push(sb);
      },
      columns: [
        {
          title: 'Civilité', data: 'civilite', render: function (data, type, row) {
            const roleName = row.civilite;
            return roleName || '';
          },
          orderData: [1],
          orderSequence: ['asc', 'desc'],
          type: 'string',
        },
        {
          title: 'Nom', data: 'nom', render: function (data, type, full) {
            const colorClasses = ['success', 'info', 'warning', 'danger'];
            const randomColorClass = colorClasses[Math.floor(Math.random() * colorClasses.length)];

            const initials = data[0].toUpperCase();
            const symbolLabel = `
              <div class="symbol-label fs-3 bg-light-${randomColorClass} text-${randomColorClass}">
                ${initials}
              </div>
            `;

            const nomEtPrenoms = `
              <div class="d-flex flex-column" data-action="view" data-id="${full.idPersonne}">
                <a href="javascript:;" class="text-gray-800 text-hover-primary mb-1">${data}</a>
                <span>${full.prenom}</span>
              </div>
            `;
            return `
              <div class="symbol symbol-circle symbol-50px overflow-hidden me-3" data-action="view" data-id="${full.idPersonne}">
                <a href="javascript:;">
                  ${symbolLabel}
                </a>
              </div>
              ${data} ${full.prenom}
            `;
          }
        },
        {
          title: 'Sexe', data: 'sexe', render: function (data, type, row) {
            const roleName = row.sexe;
            return roleName || '';
          },
          orderData: [1],
          orderSequence: ['asc', 'desc'],
          type: 'string',
        },
        {
          title: 'Nationnalité', data: 'paysNationnalite', render: function (data, type, row) {
            const roleName = row.paysNationalite?.libelleFr;
            return roleName || '';
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
        actions.push(show);
        actions.push(edit);
        /* actions.push(separator);
        actions.push(delete1); */
        actions.push(parentActionEnd);

        return actions.join('');
      }
    }
  }

  supprimer(id: number) {
    const modalRef = this.modalService.open(DeletePersonnephysiqueSanctionneeModalComponent);
    modalRef.componentInstance.id = id;
    //modalRef.result.then(() => this.personnePhysiqueService.fetch(), () => {});
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

          case 'view':
            this.router.navigate(['view', id], {relativeTo: this.route});
            break;

          case 'delete':
            this.supprimer(id);
            break;
        }
      }
    });
  }
}


