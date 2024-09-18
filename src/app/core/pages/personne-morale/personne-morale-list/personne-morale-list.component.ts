import {AfterViewInit, Component, EventEmitter, OnDestroy, OnInit, Renderer2, ViewChild} from '@angular/core';
import {Subscription, switchMap, tap} from "rxjs";
import {ActivatedRoute, NavigationExtras, Router} from "@angular/router";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {DeletePersonneMoraleModalComponent} from "../delete-personne-morale-modal/delete-personne-morale-modal.component";
import {filter, map} from "rxjs/operators";
import {SwalComponent} from "@sweetalert2/ngx-sweetalert2";
import {SweetAlertOptions} from "sweetalert2";
import {PersonneMoraleService} from "../../../../crm/services/personne/personne.morale.service";
import {Config} from "datatables.net";

@Component({
  selector: 'app-personne-morale-list',
  templateUrl: './personne-morale-list.component.html',
  styleUrls: ['./personne-morale-list.component.scss']
})
export class PersonneMoraleListComponent implements OnInit, OnDestroy, AfterViewInit{

  urlSuffix: string = "qualite/";
  newButtonTitle: string = "Nouveau";
  qualite?: string | null;
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
    public entityService: PersonneMoraleService,
    private route: ActivatedRoute,
    private router: Router,
    private modalService: NgbModal) {
    // this.router.routeReuseStrategy.shouldReuseRoute = () => false;
  }

  ngOnInit(): void {
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
          title: 'RAISON SOCIALE', data: 'denomination', render: function (data, type, row) {
            return row.denomination || '';
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
        // $('td:eq(0)', row).addClass('d-flex align-items-center');
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
        const parentActionEnd = `</ul></div>`;
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
    }
  }

  supprimer(id: string) {
    const modalRef = this.modalService.open(DeletePersonneMoraleModalComponent);
    modalRef.componentInstance.id = id;
    modalRef.result.then(() => this.entityService.fetch(), () => {});
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
              queryParams: { 'estConvertie': true },
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
}
